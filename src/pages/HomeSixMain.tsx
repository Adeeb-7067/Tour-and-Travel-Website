import { useNavigate } from "react-router-dom"
import HomeSix from "../components/homes/home-six"
import SEO from "../components/SEO"
import Wrapper from "../layouts/Wrapper"
import { useEffect } from "react"


const HomeSixMain = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <Wrapper>
      <SEO pageTitle={'Home'} />
      <HomeSix />
    </Wrapper>
  );
};

export default HomeSixMain;