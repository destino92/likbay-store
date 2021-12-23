import { useState, useEffect } from "react";
import Head from 'next/head';
import Router from "next/router";
import { magic } from "../lib/magic";
import { useUser } from "../lib/hooks";
import LoginForm from "../components/customer/LoginHandler";
import Root from '../components/common/Root';
import Footer from '../components/common/Footer';

const Login = () => {
  let user = useUser();
  console.log(user);

  useEffect(() => {
    if (user) user.issuer && Router.push("/account");
  }, [user]);

  const [disabled, setDisabled] = useState(false);

  async function handleLogin(tel) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered

      // Trigger Magic link to be sent to user
      let didToken = await magic.auth.loginWithSMS({
        phoneNumber: "+242" + tel
      });

      // Validate didToken with server
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify({ tel }),
      });

      console.log(res)

      res.status === 200 && Router.push("/account");
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  return (
    <Root>
      <Head>
        <title>Connexion</title>
      </Head>
      <div className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <LoginForm disabled={disabled} onTelSubmit={handleLogin} />
          </div>
        </div>
      </div>
      <Footer />
    </Root>
  );
};

export default Login;