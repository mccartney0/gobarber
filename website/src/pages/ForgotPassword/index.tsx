import React, { useRef, useCallback, useState } from 'react';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('The e-mail is required')
            .email('The email must be valid'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // recuperacao de senha
        await api.post('/password/forgot', { email: data.email });

        addToast({
          type: 'success',
          title: 'Recovery email sent',
          description:
            'The email to confirm the password recovery was sent successfully!',
        });

        // history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Password Recovery error',
          description:
            'An error has occurred while trying to recover your password. Try again.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recover Password</h1>

            <Input autoFocus name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recover my password
            </Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Already have an account
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
