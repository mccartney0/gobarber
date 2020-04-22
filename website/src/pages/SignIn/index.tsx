import React, { useRef, useCallback, useContext } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { AuthContext } from '../../context/AuthContext';
import getValidationErros from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useContext(AuthContext);

  const handleSubmit = useCallback(
    async (data: object) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('The name is required'),
          email: Yup.string()
            .required('The e-mail is required')
            .email('The email must be valid'),
          password: Yup.string().required('Password is required'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        signIn();
      } catch (error) {
        const errors = getValidationErros(error);
        formRef.current?.setErrors(errors);
      }
    },
    [signIn],
  );

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Sign in your account</h1>

          <Input autoFocus name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Password"
          />
          <Button type="submit">Sign In</Button>
          <a href="#forgot">Forgot my password</a>
        </Form>
        <a href="#create">
          <FiLogIn />
          Create my account
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
