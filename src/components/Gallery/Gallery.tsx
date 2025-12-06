import { useEffect, useState } from "react";
import HeaderSix from "../../layouts/headers/HeaderSix";
import axios from "axios";
import thumbnailImage from "../../../public/assets/img/download.png";
import { useNavigate } from "react-router-dom";

// Skeleton Components
const CardSkeleton = () => (
  <div className="col-xl-4 col-lg-6 col-md-6">
    <div className="rounded-4 overflow-hidden shadow-sm bg-light placeholder-glow p-3">
      <div className="w-100 bg-secondary placeholder" style={{ height: "200px" }}></div>
      <div className="mt-3 w-50 bg-secondary placeholder" style={{ height: "20px" }}></div>
    </div>
  </div>
);

interface LocationCardType {
  id: number | string;
  stateName?: string;
}

const Gallery: React.FC = () => {

  const [states, setStates] = useState<LocationCardType[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchState = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${BASE_URL}/states?page=${page}`);

      const paginated = res.data.pagination;
      setPagination({
        currentPage: paginated.currentPage,
        totalPages: paginated.totalPages,
        hasNextPage: paginated.hasNextPage,
        hasPrevPage: paginated.hasPrevPage,
      });

      const mappedData = res?.data?.data?.map((item: any) => ({
        id: item?._id,
        stateName: item?.stateName,
      }));

      setStates(mappedData);
    } catch (error) {
      setError("Failed to load states. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState(1);
  }, []);

  const handleLocationClick = (loc: LocationCardType) => {
    navigate(`/gallery/${loc.id}`, {
      state: { name: loc.stateName }
    });
  };

  return (
    <>
      <HeaderSix />

      <div className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold display-6">Travel Memories Gallery</h2>
          <p className="text-muted">Explore real travel moments captured by our explorers</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="row g-4">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-danger text-center fw-semibold">{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && states.length === 0 && (
          <p className="text-center text-muted">No states available.</p>
        )}

        {/* REAL DATA */}
        {!loading && !error && states.length > 0 && (
          <div className="row g-4">
            {states.map((loc) => (
              <div key={loc.id} className="col-xl-4 col-lg-6 col-md-6">
                <div
                  className="rounded-4 overflow-hidden shadow-lg gallery-card"
                  onClick={() => handleLocationClick(loc)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={thumbnailImage} className="w-100 gallery-img" />
                  <div className="p-3">
                    <h5 className="fw-bold mb-1">{loc.stateName}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && states.length > 0 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              className="btn btn-outline-dark"
              disabled={!pagination.hasPrevPage}
              onClick={() => fetchState(pagination.currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`btn ${pagination.currentPage === page ? "btn-primary" : "btn-light border"}`}
                  onClick={() => fetchState(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="btn btn-outline-dark"
              disabled={!pagination.hasNextPage}
              onClick={() => fetchState(pagination.currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style>{`
        .gallery-card {
          transition: all 0.35s ease;
          background: #fff;
          border: none;
        }
        .gallery-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
        }
        .gallery-img {
          height: 250px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-card:hover .gallery-img {
          transform: scale(1.08);
        }
      `}</style>
    </>
  );
};

export default Gallery;
