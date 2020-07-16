import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimatedForm } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface FormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleFormSubmision = useCallback(
    async (data: FormData) => {
      formRef.current?.setErrors({});

      const validator = Yup.object().shape({
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um email válido'),
      });

      try {
        await validator.validate(data, { abortEarly: false });

        setIsLoading(true);

        await api.post('/passwords/forgot', {
          email: data.email,
        });

        addToast({
          title: 'Email de recuperação enviado',
          description:
            'Enviamos um email para redifinição da senha. Confira sua caixa de entrada.',
          duration: 10000,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
        } else {
          addToast({
            title: 'Erro ao recuperar senha',
            description:
              'Ocorreu um erro ao recuperar sua senha. Tente novamente.',
            type: 'error',
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <AnimatedForm>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleFormSubmision}>
            <h1>Recupere sua senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button type="submit" isLoading={isLoading}>
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar para login
          </Link>
        </AnimatedForm>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
