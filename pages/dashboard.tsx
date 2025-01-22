import { GetServerSideProps } from "next";

const Dashboard = () => {
  return <h1>Bem-vindo ao Dashboard!</h1>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  return { props: {} };
};

export default Dashboard;
