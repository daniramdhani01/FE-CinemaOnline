import { Container } from "react-bootstrap";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/userContext";

//import components
import Header from "../components/Header";
import Buy from "../components/Buy";
import Login from "../components/Login";
import Register from "../components/Register";
import { getLocalStorage } from "../helper";
import { QUERY_KEYS } from "../config/queryKeys";
import { fetchFilmDetail, fetchFilms } from "../config/services";
import { PageLoading } from "../components/LoadingSpinner";

export default function LandingPage() {
  document.title = "Cinema Online";

  const localSession = getLocalStorage("AUS") || {};
  const { isAdmin, isLogin } = localSession;

  const navigate = useNavigate();
  const [state] = useContext(UserContext);
  const [buymodal, setbuymodal] = useState(false);
  const [modalRegister, setmodalregister] = useState(false);
  const [modalLogin, setmodallogin] = useState(false);

  const { data: films = [], isLoading: isLoadingFilms } = useQuery({
    queryKey: QUERY_KEYS.FILMS,
    queryFn: fetchFilms,
  });

  const heroFilm = useMemo(() => films[0], [films]);

  const { data: heroFilmDetail } = useQuery({
    queryKey: heroFilm?.id
      ? QUERY_KEYS.FILM_DETAIL(heroFilm.id)
      : QUERY_KEYS.FILM_DETAIL("placeholder"),
    queryFn: () => fetchFilmDetail(heroFilm.id),
    enabled: Boolean(heroFilm?.id && isLogin && !isAdmin),
  });

  const status = isAdmin ? "Approved" : heroFilmDetail?.status ?? "-";

  return (
    <>
      <Header />
      {isLoadingFilms ? (
        <PageLoading message="Loading films..." />
      ) : heroFilm ? (
        <>
          {/* poster here */}
          <div className="poster-container my-4 d-flex justify-content-center">
            <img
              src={heroFilm.poster}
              style={{ width: 1000, height: 370, objectFit: "cover" }}
              alt={heroFilm.title}
            />
            <div className="poster-caption">
              <h1 className="mb-3">
                <div style={{ color: " #A52620" }}>{heroFilm.title}</div>
              </h1>
              <h5>{heroFilm.category}</h5>
              <h5 style={{ color: "#CD2E71" }}>{heroFilm.price}</h5>
              <div className="poster-desc">{heroFilm.desc}</div>

              {isAdmin || status === "Approved" ? (
                <button
                  type="button"
                  className="btn-pink mt-4"
                  onClick={() => navigate(`/detail-film/${heroFilm.id}`)}
                >
                  Play Now
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-pink mt-4"
                  onClick={
                    state.isLogin
                      ? () => setbuymodal(true)
                      : () => setmodallogin(true)
                  }
                >
                  Buy Now
                </button>
              )}
              <Buy
                show={buymodal}
                onHide={() => setbuymodal(false)}
                idfilm={heroFilm.id}
                buymodal={setbuymodal}
                setmodallogin={setmodallogin}
                setmodalregister={setmodalregister}
              />

              <Register
                show={modalRegister}
                onHide={() => setmodalregister(false)}
                buymodal={setbuymodal}
                setmodallogin={setmodallogin}
                setmodalregister={setmodalregister}
              />

              <Login
                show={modalLogin}
                buymodal={setbuymodal}
                onHide={() => setmodallogin(false)}
                setmodallogin={setmodalregister}
                setmodalregister={setmodallogin}
              />
            </div>
          </div>

          {/* list film here */}
          <div className="mb-3">
            <h5>List Film</h5>
            <Container className="mt-3 d-flex flex-wrap">
              {films.map((item) => (
                <div className="col-2 p-2" key={item.id} style={{ height: 225 }}>
                  <button
                    onClick={() => navigate(`/detail-film/${item.id}`)}
                    style={{ background: "unset", border: "unset" }}
                  >
                    <img
                      src={item.thumbnail}
                      className="rounded img-fluid"
                      style={{ maxHeight: 225, objectFit: "cover" }}
                      alt={item.title}
                    />
                  </button>
                </div>
              ))}
            </Container>
          </div>
        </>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <h4>No Data Found</h4>
        </div>
      )}
    </>
  );
}
