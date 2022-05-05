import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();
  auth.onAuthStateChanged(function (user) {
    console.log(user, user?.uid);
    if (user?.uid) return router.push("/trains");
    else return router.push("/signin");
  });
  if (loading) return <p>Loading...</p>;
}
