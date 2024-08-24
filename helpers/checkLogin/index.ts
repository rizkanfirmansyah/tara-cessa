import { GetServerSideProps } from "next";
import { cookies } from "next/headers";
import { useRouter } from "next/router";

type CheckCookiesProps = {
  isLoggedIn: boolean;
};

const CheckCookies = ({ isLoggedIn }: CheckCookiesProps) => {
  const router = useRouter();

  // If user is logged in, redirect to home page
  if (isLoggedIn) {
    router.push("/");
  }

  return null; // This component does not render anything
};

export const getServerSideProps: GetServerSideProps<CheckCookiesProps> = async () => {
  const cookie = cookies();

  return {
    props: {
      isLoggedIn: !!cookie.get("token"), // Check if token cookie exists
    },
  };
};

export default CheckCookies;
