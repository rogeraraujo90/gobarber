import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import {
  isToday,
  isTomorrow,
  format,
  parseISO,
  isAfter,
  isWeekend,
  addBusinessDays,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-day-picker/lib/style.css';
import { Link } from 'react-router-dom';
import {
  Container,
  HeaderContent,
  Profile,
  Header,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface DayAvailability {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  formattedHour: string;
  customer: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { loggedUser, signOut } = useAuth();
  const [selectedDate, updateSelectedDate] = useState(() => {
    const today = new Date();
    if (isWeekend(today)) {
      return addBusinessDays(today, 1);
    }

    return today;
  });
  const [selectedMonth, updateSelectedMonth] = useState(new Date());
  const [monthAvailability, updateMonthAvailability] = useState<
    DayAvailability[]
  >([]);
  const [appointments, updateAppointments] = useState<Appointment[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    modifiers.available && !modifiers.disabled && updateSelectedDate(day);
  }, []);

  useEffect(() => {
    const fetchMonthAvailability = async (): Promise<void> => {
      const availability = await api.get(
        `/providers/${loggedUser.id}/month-availability`,
        {
          params: {
            month: selectedMonth.getMonth() + 1,
            year: selectedMonth.getFullYear(),
          },
        }
      );

      updateMonthAvailability(availability.data);
    };

    fetchMonthAvailability();
  }, [selectedMonth, loggedUser.id]);

  useEffect(() => {
    const fetchAppointments = async (): Promise<void> => {
      const response = await api.get<Appointment[]>('providers/schedule', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      });

      const formattedAppointments = response.data.map((appointment) => {
        return {
          ...appointment,
          formattedHour: format(parseISO(appointment.date), 'HH:mm'),
        };
      });

      updateAppointments(formattedAppointments);
    };

    fetchAppointments();
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const days = [] as Date[];

    monthAvailability.forEach((availability) => {
      if (availability.available === false) {
        days.push(
          new Date(
            selectedMonth.getFullYear(),
            selectedMonth.getMonth(),
            availability.day
          )
        );
      }
    });

    return days;
  }, [monthAvailability, selectedMonth]);

  const formattedDayDescription = useMemo(() => {
    if (isToday(selectedDate)) {
      return 'Hoje';
    }

    if (isTomorrow(selectedDate)) {
      return 'Amanhã';
    }

    return undefined;
  }, [selectedDate]);

  const formattedDayString = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' LLLL", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const formattedWeekDayDescription = useMemo(() => {
    return format(selectedDate, 'EEEE', {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAppoitments = useMemo(
    () =>
      appointments.filter(
        (appointment) => parseISO(appointment.date).getHours() < 12
      ),
    [appointments]
  );

  const afternoonAppoitments = useMemo(
    () =>
      appointments.filter(
        (appointment) => parseISO(appointment.date).getHours() >= 12
      ),
    [appointments]
  );

  const nextAppointment = useMemo(() => {
    return isToday(selectedDate)
      ? appointments.find((appointment) =>
          isAfter(parseISO(appointment.date), Date.now())
        )
      : undefined;
  }, [appointments, selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={loggedUser.avatar_url} alt={loggedUser.name} />
            <div>
              <span>Bem-vindo</span>
              <Link to="/profile">
                <strong>{loggedUser.name}</strong>
              </Link>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {formattedDayDescription && <span>{formattedDayDescription}</span>}
            <span>{formattedDayString}</span>
            <span>{formattedWeekDayDescription}</span>
          </p>

          {nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>

              <div>
                <img
                  src={nextAppointment.customer.avatar_url}
                  alt={nextAppointment.customer.name}
                />

                <strong>{nextAppointment.customer.name}</strong>
                <span>
                  <FiClock /> {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppoitments.length === 0 && (
              <span>Não há agendamentos neste período</span>
            )}

            {morningAppoitments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock /> {appointment.formattedHour}
                </span>

                <div>
                  <img
                    src={appointment.customer.avatar_url}
                    alt={appointment.customer.name}
                  />

                  <strong>{appointment.customer.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppoitments.length === 0 && (
              <span>Não há agendamentos neste período</span>
            )}

            {afternoonAppoitments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock /> {appointment.formattedHour}
                </span>

                <div>
                  <img
                    src={appointment.customer.avatar_url}
                    alt={appointment.customer.name}
                  />

                  <strong>{appointment.customer.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            onDayClick={handleDateChange}
            onMonthChange={updateSelectedMonth}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
