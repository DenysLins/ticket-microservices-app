import React, { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default function SignOut() {
  const { doRequest } = useRequest();

  useEffect(() => {
    doRequest("/api/users/signout", "post", {}, () => Router.push("/"));
  });

  return <div>Signing you out...</div>;
}
