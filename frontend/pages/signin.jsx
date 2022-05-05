import { TextInput, PasswordInput, Title, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import Head from "next/head";

import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import styles from "@pages/styles/signin.module.scss";
import { useEffect, useState } from "react";

export default function Home() {
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      console.log(user);
      if (user?.uid) return router.push("/trains");
    });
  });

  const auth = getAuth();
  const router = useRouter();

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
      });

      console.log(user);
      router.push("/trains");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Portfolio</title>
        <meta name="description" content="Welcome to TGV Max Weekends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Title order={1} className={styles.title}>
          {" "}
          TGV Max Weekends
        </Title>

        <TextInput
          required
          label="Email"
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
          className={styles.signin_button}
          loading={loading}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
