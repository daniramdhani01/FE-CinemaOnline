import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

//import page
import Header from "../components/Header";
import { QUERY_KEYS } from "../config/queryKeys";
import { fetchMyFilms } from "../config/services";

export default function MylistFilm() {
  const title = "My List Film";
  document.title = title + " | Cinema Online";

  const { data: filmList = [] } = useQuery({
    queryKey: QUERY_KEYS.MY_FILMS,
    queryFn: fetchMyFilms,
  });

  return (
    <>
      <Header />

      <div className="mt-5">
        <div
          className="fs-36 w-100 fw-bold"
          style={{ paddingLeft: "7.5%", paddingRight: "7.5%" }}
        >
          My List Film
        </div>
        <Container className="mt-3 d-flex flex-wrap">
          {filmList.map((item) => (
            <div className="col-2 p-2" key={item.film.id}>
              <Link to={`/detail-film/${item.film.id}`}>
                <img
                  src={item.film.thumbnail}
                  className="rounded img-fluid"
                  alt={item.film.title}
                />
              </Link>
            </div>
          ))}
        </Container>
      </div>
    </>
  );
}
