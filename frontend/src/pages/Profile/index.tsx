import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import { Container, Content, AnimatedForm, AvatarContent } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { loggedUser, updateUser } = useAuth();

  const handleFormSubmision = useCallback(
    async (data: ProfileFormData) => {
      formRef.current?.setErrors({});

      const validator = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório.'),
        email: Yup.string()
          .required('Email obrigatório.')
          .email('Digite um email válido.'),
        oldPassword: Yup.string(),
        password: Yup.string().when('oldPassword', {
          is: (oldPassword) => !!oldPassword.length,
          then: Yup.string().required().min(6, 'Mínimo de 6 caracteres.'),
        }),
        passwordConfirmation: Yup.string().when('oldPassword', {
          is: (oldPassword) => !!oldPassword.length,
          then: Yup.string().oneOf(
            [Yup.ref('password')],
            'Senhas não são iguais'
          ),
        }),
      });

      try {
        await validator.validate(data, { abortEarly: false });

        const { name, email, oldPassword } = data;
        const updatedData = oldPassword ? data : { name, email };

        await api.patch('/profile', updatedData);

        addToast({
          title: 'Perfil atualizado com sucesso',
          type: 'success',
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
        } else {
          addToast({
            title: 'Erro ao atualizar perfil',
            description:
              'Tente novamente. Ou, se o problema persistir, contacte o suporte',
            type: 'error',
          });
        }
      }
    },
    [addToast, history]
  );

  const handleOpenChangeAvatar = useCallback(() => {
    document.getElementById('avatar')?.click();
  }, []);

  const handleSelectedNewAvatar = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const updateAvatar = async (): Promise<void> => {
        if (event.target.files) {
          const formData = new FormData();

          formData.append('avatar', event.target.files[0]);

          const freshUserData = await api.patch('/users/avatar', formData);

          updateUser(freshUserData.data);
        }
      };

      updateAvatar();
    },
    [updateUser]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <AnimatedForm>
          <Form
            ref={formRef}
            initialData={{
              name: loggedUser.name,
              email: loggedUser.email,
            }}
            onSubmit={handleFormSubmision}
          >
            <AvatarContent>
              <img src={loggedUser.avatar_url} alt={loggedUser.name} />
              <button type="button" onClick={handleOpenChangeAvatar}>
                <FiCamera />
              </button>

              <input
                id="avatar"
                type="file"
                style={{ display: 'none' }}
                onChange={handleSelectedNewAvatar}
              />
            </AvatarContent>

            <h1>Meu perfil</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <div className="profile__password-container">
              <Input
                name="oldPassword"
                type="password"
                icon={FiLock}
                placeholder="Senha atual"
              />
              <Input
                name="password"
                type="password"
                icon={FiLock}
                placeholder="Nova senha"
              />
              <Input
                name="passwordConfirmation"
                type="password"
                icon={FiLock}
                placeholder="Confirmar senha"
              />
            </div>

            <Button type="submit">Confirmar mudanças</Button>
          </Form>
        </AnimatedForm>
      </Content>
    </Container>
  );
};

export default Profile;
