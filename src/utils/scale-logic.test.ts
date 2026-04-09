import { describe, it, expect } from 'vitest';
import { 
  getPlannedDayInfo,
  getDayInfo, 
  getMonthMetrics,
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
  customCycle: [],
  displayPlantonsCount: 10,
  financial: {
    mode: 'per_shift',
    value: 200,
    currency: 'BRL'
  }
};

describe('Lógica de Escala Certa', () => {
  
  describe('Cálculo de Status (Modo Preset 12x36)', () => {
    it('deve retornar "trabalho" no dia de início se startStatus for "trabalho"', () => {
      const date = new Date(2026, 3, 1);
      expect(getPlannedDayInfo(date, baseConfig).status).toBe('trabalho');
    });

    it('deve alternar para "folga" no dia seguinte', () => {
      const date = new Date(2026, 3, 2);
      expect(getPlannedDayInfo(date, baseConfig).status).toBe('folga');
    });

    it('deve funcionar corretamente para datas anteriores à data base', () => {
      const date = new Date(2026, 2, 31); // 31/03/2026
      expect(getPlannedDayInfo(date, baseConfig).status).toBe('folga');
    });
  });

  describe('Cálculo de Status (Modo Ciclo Personalizado)', () => {
    const customConfig: ScaleConfig = {
      ...baseConfig,
      shiftMode: 'custom_cycle',
      customCycle: [
        { id: '1', type: 'trabalho', label: 'Manhã', startTime: '07:00', endTime: '15:00', crossesMidnight: false },
        { id: '2', type: 'trabalho', label: 'Tarde', startTime: '15:00', endTime: '23:00', crossesMidnight: false },
        { id: '3', type: 'trabalho', label: 'Noite', startTime: '23:00', endTime: '07:00', crossesMidnight: true },
        { id: '4', type: 'folga', label: 'Folga', startTime: '00:00', endTime: '00:00', crossesMidnight: false }
      ]
    };

    it('deve seguir a sequência do ciclo corretamente', () => {
      expect(getPlannedDayInfo(new Date(2026, 3, 1), customConfig).label).toBe('Manhã');
      expect(getPlannedDayInfo(new Date(2026, 3, 2), customConfig).label).toBe('Tarde');
      expect(getPlannedDayInfo(new Date(2026, 3, 3), customConfig).label).toBe('Noite');
      expect(getPlannedDayInfo(new Date(2026, 3, 4), customConfig).label).toBe('Folga');
    });

    it('deve repetir o ciclo infinitamente', () => {
      expect(getPlannedDayInfo(new Date(2026, 3, 5), customConfig).label).toBe('Manhã');
    });

    it('deve calcular horários que cruzam meia-noite corretamente no ciclo', () => {
      const info = getPlannedDayInfo(new Date(2026, 3, 3), customConfig);
      expect(info.hours).toBe('23:00 - 07:00');
      expect(info.cycleStep?.crossesMidnight).toBe(true);
    });

    it('deve funcionar para escala 24x72', () => {
      const config24x72: ScaleConfig = {
        ...baseConfig,
        shiftMode: 'custom_cycle',
        customCycle: [
          { id: '1', type: 'trabalho', label: '24h', startTime: '07:00', endTime: '07:00', crossesMidnight: true },
          { id: '2', type: 'folga', label: 'Folga', startTime: '00:00', endTime: '00:00' },
          { id: '3', type: 'folga', label: 'Folga', startTime: '00:00', endTime: '00:00' },
          { id: '4', type: 'folga', label: 'Folga', startTime: '00:00', endTime: '00:00' }
        ]
      };
      expect(getPlannedDayInfo(new Date(2026, 3, 1), config24x72).status).toBe('trabalho');
      expect(getPlannedDayInfo(new Date(2026, 3, 2), config24x72).status).toBe('folga');
      expect(getPlannedDayInfo(new Date(2026, 3, 5), config24x72).status).toBe('trabalho');
    });
  });

  describe('Turnos (Presets)', () => {
    it('deve retornar turno fixo se shiftMode for "fixed"', () => {
      const config: ScaleConfig = { ...baseConfig, shiftMode: 'fixed', fixedShift: 'noturno' };
      const date = new Date(2026, 3, 1);
      expect(getPlannedDayInfo(date, config).shift).toBe('noturno');
    });

    it('deve alternar turno semanalmente no modo "alternating"', () => {
      const dateW1 = new Date(2026, 3, 1);
      expect(getPlannedDayInfo(dateW1, baseConfig).shift).toBe('diurno');

      const dateW2 = new Date(2026, 3, 6); 
      expect(getPlannedDayInfo(dateW2, baseConfig).shift).toBe('noturno');
    });
  });

  describe('Exceções Manuais (Overrides)', () => {
    it('deve respeitar um override de folga em um dia de trabalho previsto', () => {
      const date = new Date(2026, 3, 1);
      const events: UserEvent[] = [{
        id: '1',
        date: date.toISOString(),
        title: 'Folga Extra',
        type: 'folga_extra',
        isOverride: true,
        overrideStatus: 'folga'
      }];
      const info = getDayInfo(date, baseConfig, events);
      expect(info.actualStatus).toBe('folga');
      expect(info.isOverridden).toBe(true);
    });

    it('deve respeitar um override de trabalho em um dia de folga previsto', () => {
      const date = new Date(2026, 3, 2);
      const events: UserEvent[] = [{
        id: '2',
        date: date.toISOString(),
        title: 'Plantão Extra',
        type: 'plantao_extra',
        isOverride: true,
        overrideStatus: 'trabalho'
      }];
      const info = getDayInfo(date, baseConfig, events);
      expect(info.actualStatus).toBe('trabalho');
      expect(info.isOverridden).toBe(true);
    });
  });

  describe('Métricas Mensais e Financeiro', () => {
    it('deve calcular corretamente o banco de horas', () => {
      const events: UserEvent[] = [{
        id: '3',
        date: new Date(2026, 3, 2).toISOString(),
        title: 'Extra',
        type: 'plantao_extra',
        isOverride: true,
        overrideStatus: 'trabalho'
      }];
      const metrics = getMonthMetrics(new Date(2026, 3, 1), baseConfig, events);
      expect(metrics.hourBank).toBe(12);
    });

    it('deve calcular financeiro por plantão', () => {
      const config: ScaleConfig = { 
        ...baseConfig, 
        financial: { mode: 'per_shift', value: 250, currency: 'BRL' } 
      };
      const metrics = getMonthMetrics(new Date(2026, 3, 1), config);
      expect(metrics.estimatedPayment).toBe(15 * 250);
    });

    it('deve calcular financeiro por hora', () => {
      const config: ScaleConfig = { 
        ...baseConfig, 
        financial: { mode: 'per_hour', value: 20, currency: 'BRL' } 
      };
      const metrics = getMonthMetrics(new Date(2026, 3, 1), config);
      expect(metrics.estimatedPayment).toBe(180 * 20); // 15 plantões * 12h
    });

    it('deve retornar zero se valor financeiro for zero', () => {
      const config: ScaleConfig = { ...baseConfig, financial: { mode: 'per_shift', value: 0, currency: 'BRL' } };
      const metrics = getMonthMetrics(new Date(2026, 3, 1), config);
      expect(metrics.estimatedPayment).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com meses de diferentes durações', () => {
      const fev = getMonthMetrics(new Date(2026, 1, 1), baseConfig);
      expect(fev.days.length).toBe(28);
      const dez = getMonthMetrics(new Date(2026, 11, 1), baseConfig);
      expect(dez.days.length).toBe(31);
    });

    it('deve lidar com múltiplas exceções no mesmo mês', () => {
      const events: UserEvent[] = [
        { id: '1', date: new Date(2026, 3, 2).toISOString(), title: 'Extra', type: 'plantao_extra', isOverride: true, overrideStatus: 'trabalho' },
        { id: '2', date: new Date(2026, 3, 3).toISOString(), title: 'Falta', type: 'ausencia', isOverride: true, overrideStatus: 'folga' },
      ];
      const metrics = getMonthMetrics(new Date(2026, 3, 1), baseConfig, events);
      expect(metrics.actualWorkDays).toBe(metrics.plannedWorkDays);
    });
  });
});
