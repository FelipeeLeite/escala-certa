import { describe, it, expect } from 'vitest';
import { 
  getDayStatus, 
  getShiftForDate, 
  getDayInfo, 
  getMonthMetrics,
  getSummary 
} from './scale-logic';
import { ScaleConfig, UserEvent } from '@/types/scale';

// Configuração padrão para os testes
const baseConfig: ScaleConfig = {
  startDate: new Date(2026, 3, 1).toISOString(), // 01/04/2026 (Quarta-feira)
  startStatus: 'trabalho',
  shiftMode: 'alternating',
  initialShift: 'diurno',
  fixedShift: 'diurno',
  dayShiftHours: { start: '07:00', end: '19:00' },
  nightShiftHours: { start: '19:00', end: '07:00' },
  displayPlantonsCount: 10,
  financial: {
    mode: 'per_shift',
    value: 200,
    currency: 'BRL'
  }
};

describe('Lógica de Escala Certa (12x36)', () => {
  
  describe('Cálculo de Status (Trabalho/Folga)', () => {
    it('deve retornar "trabalho" no dia de início se startStatus for "trabalho"', () => {
      const date = new Date(2026, 3, 1);
      expect(getDayStatus(date, baseConfig)).toBe('trabalho');
    });

    it('deve alternar para "folga" no dia seguinte', () => {
      const date = new Date(2026, 3, 2);
      expect(getDayStatus(date, baseConfig)).toBe('folga');
    });

    it('deve funcionar corretamente para datas anteriores à data base', () => {
      const date = new Date(2026, 2, 31); // 31/03/2026
      expect(getDayStatus(date, baseConfig)).toBe('folga');
    });
  });

  describe('Turnos (Diurno/Noturno)', () => {
    it('deve retornar turno fixo se shiftMode for "fixed"', () => {
      const config: ScaleConfig = { ...baseConfig, shiftMode: 'fixed', fixedShift: 'noturno' };
      const date = new Date(2026, 3, 1);
      expect(getShiftForDate(date, config)).toBe('noturno');
    });

    it('deve alternar turno semanalmente no modo "alternating"', () => {
      // Semana 1 (01/04 a 04/04 - Quarta a Sábado) -> Diurno
      // A semana começa no Domingo (05/04) no código (weekStartsOn: 0)
      const dateW1 = new Date(2026, 3, 1);
      expect(getShiftForDate(dateW1, baseConfig)).toBe('diurno');

      // Semana 2 (começa domingo 05/04)
      const dateW2 = new Date(2026, 3, 6); // Segunda-feira
      expect(getShiftForDate(dateW2, baseConfig)).toBe('noturno');
    });
  });

  describe('Exceções Manuais (Overrides)', () => {
    it('deve respeitar um override de folga em um dia de trabalho previsto', () => {
      const date = new Date(2026, 3, 1); // Previsto: trabalho
      const events: UserEvent[] = [{
        id: '1',
        date: date.toISOString(),
        title: 'Folga Extra',
        type: 'folga_extra',
        isOverride: true,
        overrideStatus: 'folga'
      }];
      
      const info = getDayInfo(date, baseConfig, events);
      expect(info.plannedStatus).toBe('trabalho');
      expect(info.actualStatus).toBe('folga');
      expect(info.isOverridden).toBe(true);
    });

    it('deve respeitar um override de trabalho (plantão extra) em um dia de folga previsto', () => {
      const date = new Date(2026, 3, 2); // Previsto: folga
      const events: UserEvent[] = [{
        id: '2',
        date: date.toISOString(),
        title: 'Plantão Extra',
        type: 'plantao_extra',
        isOverride: true,
        overrideStatus: 'trabalho'
      }];
      
      const info = getDayInfo(date, baseConfig, events);
      expect(info.plannedStatus).toBe('folga');
      expect(info.actualStatus).toBe('trabalho');
      expect(info.isOverridden).toBe(true);
    });
  });

  describe('Métricas Mensais e Financeiro', () => {
    it('deve calcular corretamente o banco de horas (positivo)', () => {
      // 01/04 a 30/04 de 2026
      // Início Quarta (T), Qui (F), Sex (T)...
      // Dias ímpares trabalham, dias pares folgam.
      // Abr/2026 tem 30 dias. Ímpares: 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29 (15 dias)
      
      const events: UserEvent[] = [{
        id: '3',
        date: new Date(2026, 3, 2).toISOString(), // Quinta-feira (seria folga)
        title: 'Extra',
        type: 'plantao_extra',
        isOverride: true,
        overrideStatus: 'trabalho'
      }];

      const metrics = getMonthMetrics(new Date(2026, 3, 1), baseConfig, events);
      expect(metrics.plannedWorkDays).toBe(15);
      expect(metrics.actualWorkDays).toBe(16);
      expect(metrics.hourBank).toBe(12);
    });

    it('deve calcular financeiro por plantão corretamente', () => {
      const config: ScaleConfig = { 
        ...baseConfig, 
        financial: { mode: 'per_shift', value: 250, currency: 'BRL' } 
      };
      const metrics = getMonthMetrics(new Date(2026, 3, 1), config);
      expect(metrics.estimatedPayment).toBe(15 * 250);
    });

    it('deve calcular financeiro por hora corretamente', () => {
      const config: ScaleConfig = { 
        ...baseConfig, 
        financial: { mode: 'per_hour', value: 20, currency: 'BRL' } 
      };
      // 15 plantões * 12h = 180h
      const metrics = getMonthMetrics(new Date(2026, 3, 1), config);
      expect(metrics.estimatedPayment).toBe(180 * 20);
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com meses de diferentes durações (Fev, Abr, Dez)', () => {
      const fev = getMonthMetrics(new Date(2026, 1, 1), baseConfig); // Fevereiro 2026
      expect(fev.days.length).toBe(28);

      const abr = getMonthMetrics(new Date(2026, 3, 1), baseConfig); // Abril 2026
      expect(abr.days.length).toBe(30);

      const dez = getMonthMetrics(new Date(2026, 11, 1), baseConfig); // Dezembro 2026
      expect(dez.days.length).toBe(31);
    });

    it('deve lidar com múltiplas exceções no mesmo mês', () => {
      const events: UserEvent[] = [
        { id: '1', date: new Date(2026, 3, 2).toISOString(), title: 'Extra', type: 'plantao_extra', isOverride: true, overrideStatus: 'trabalho' },
        { id: '2', date: new Date(2026, 3, 3).toISOString(), title: 'Falta', type: 'ausencia', isOverride: true, overrideStatus: 'folga' },
      ];
      // 02 era folga -> virou trabalho (+1)
      // 03 era trabalho -> virou folga (-1)
      // Saldo final deve ser igual ao previsto
      const metrics = getMonthMetrics(new Date(2026, 3, 1), baseConfig, events);
      expect(metrics.actualWorkDays).toBe(metrics.plannedWorkDays);
      expect(metrics.extraShifts).toBe(1);
      expect(metrics.extraLeaves).toBe(1);
    });

    it('deve lidar com dados financeiros incompletos ou zero', () => {
      const config: ScaleConfig = { 
        ...baseConfig, 
        financial: { mode: 'per_shift', value: 0, currency: 'BRL' } 
      };
      const metrics = getMonthMetrics(new Date(2026, 3, 1), config);
      expect(metrics.estimatedPayment).toBe(0);
    });
  });
});
