import { TextInput, PasswordInput, Title, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import Head from "next/head";

import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import Radium from "radium";

function SignIn() {
  const auth = getAuth();
  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user?.uid) return router.push("/trains");
    });
  }, []);

  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8
          ? "Le Mot de passe doit ètre 8 characteres au minimum"
          : null,
    },
  });

  const signInUser = async () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setLoading(true);

      const { email, password } = form.values;
      const user = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode.includes("user-not-found"))
          form.setFieldError("email", "Utilisateur introuvable");
        else if (errorCode.includes("wrong-password"))
          form.setFieldError("password", "Mot de passe incorrect");
        setLoading(false);
      });
      if (user) return router.push("/trains");
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Crypto Portfolio</title>
        <meta name="description" content="Welcome to TGV Max Weekends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Title order={1} style={styles.title}>
          {" "}
          TGV Max Weekends
        </Title>

        <TextInput
          required
          label="Email"
          type="email"
          styles={{ label: { color: "white" } }}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Mot De Passe"
          required
          style={{ marginTop: "20px" }}
          styles={{ label: { color: "white" } }}
          {...form.getInputProps("password")}
        />
        <Button
          onClick={signInUser}
          style={styles.signin_button}
          loading={loading}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: "2rem",
    fontWeight: "bold",

    marginBottom: "20px",
  },
  signin_button: {
    width: "100%",
    marginTop: "40px",
  },
};

export default Radium(SignIn);
