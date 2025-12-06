import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import HeaderSix from "../../layouts/headers/HeaderSix";
import { BsArrowLeft } from "react-icons/bs";
import { FaVideo, FaCamera } from "react-icons/fa";
import thumbnail from "../../../public/assets/img/download.png";

interface ImageItem {
  url: string;
  caption: string;
  altText: string;
  order: number;
  _id: string;
}

interface VideoItem {
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  order: number;
  _id: string;
}

interface MediaResponse {
  images: ImageItem[];
  videos: VideoItem[];
}

const GalleryDetails = () => {
  const params = useParams();
  const stateId = params.id;
  const location = useLocation();
  const stateName = location.state?.name || "Gallery";

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [media, setMedia] = useState<MediaResponse>({ images: [], videos: [] });

  const [loading, setLoading] = useState(true);      // ⬅️ LOADING STATE
  const [error, setError] = useState<string | null>(null);  // ⬅️ ERROR STATE

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${BASE_URL}/gallery`, {
        params: { stateId }
      });

      const mediaData = res?.data?.data?.[0];

      if (mediaData) {
        setMedia({
          images: mediaData.images || [],
          videos: mediaData.videos || []
        });
      }
    } catch (error) {
      setError("Failed to load gallery. Please try again.");
      console.error("Error loading media:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    try {
      const youtubePattern = /(?:v=|youtu\.be\/)([^&]+)/;
      const match = url.match(youtubePattern);
      return match && match[1]
        ? `https://www.youtube.com/embed/${match[1]}`
        : url;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [stateId]);


  // ----------------------------
  // SKELETON PLACEHOLDERS
  // ----------------------------
  const ImageSkeleton = () => (
    <div className="col-md-4">
      <div
        className="w-100 rounded-4"
        style={{
          height: "230px",
          background: "#e5e5e5",
          animation: "pulse 1.5s infinite"
        }}
      ></div>
      <div
        className="mt-3 rounded"
        style={{
          height: "20px",
          width: "60%",
          background: "#e5e5e5",
          animation: "pulse 1.5s infinite"
        }}
      ></div>
    </div>
  );

  const VideoSkeleton = () => (
    <div className="col-md-6">
      <div
        className="w-100 rounded-4"
        style={{
          height: "260px",
          background: "#e5e5e5",
          animation: "pulse 1.5s infinite"
        }}
      ></div>

      <div
        className="mt-3 rounded"
        style={{
          height: "20px",
          width: "80%",
          background: "#e5e5e5",
          animation: "pulse 1.5s infinite"
        }}
      ></div>

      <div
        className="mt-2 rounded"
        style={{
          height: "16px",
          width: "50%",
          background: "#e5e5e5",
          animation: "pulse 1.5s infinite"
        }}
      ></div>
    </div>
  );

  // ----------------------------

  return (
    <>
      <HeaderSix />

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1 }
            50% { opacity: 0.4 }
            100% { opacity: 1 }
          }
        `}
      </style>

      <div className="container py-5">
        <button
          className="btn btn-outline-dark rounded-pill px-4 py-2 mb-3"
          onClick={() => window.history.back()}
        >
          <BsArrowLeft className="me-2" /> Back
        </button>

        <h3 className="fw-bold mb-4">{stateName}</h3>

        {/* Tabs */}
        <div className="d-flex justify-content-center mb-20 gap-3">
          <button
            className={`btn px-4 py-2 rounded-pill fw-semibold shadow-sm ${
              activeTab === "images" ? "btn-primary" : "btn-light border"
            }`}
            onClick={() => setActiveTab("images")}
          >
            <FaCamera className="me-2" /> Images
          </button>

          <button
            className={`btn px-4 py-2 rounded-pill fw-semibold shadow-sm ${
              activeTab === "videos" ? "btn-primary" : "btn-light border"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            <FaVideo className="me-2" /> Videos
          </button>
        </div>

        {/* ERROR UI */}
        {error && (
          <div className="alert alert-danger text-center">
            {error}
            <br />
            <button className="btn btn-sm btn-dark mt-2" onClick={fetchMedia}>
              Retry
            </button>
          </div>
        )}

        <div className="row g-4">
          {/* SKELETONS */}
          {loading &&
            [...Array(6)].map((_, i) =>
              activeTab === "images" ? (
                <ImageSkeleton key={i} />
              ) : (
                <VideoSkeleton key={i} />
              )
            )}

          {/* IMAGES */}
          {!loading &&
            activeTab === "images" &&
            media.images.map((img) => (
              <div key={img._id} className="col-md-4">
                <img
                  src={img.url || thumbnail}
                  alt={img.altText}
                  className="w-100 gallery-img"
                  onError={(e) => {
                    e.currentTarget.src = thumbnail;
                  }}
                />
                <h5>{img.altText}</h5>
              </div>
            ))}

          {/* VIDEOS */}
          {!loading &&
            activeTab === "videos" &&
            media.videos.map((vid) => (
              <div key={vid._id} className="col-md-6">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={getEmbedUrl(vid.url)}
                    className="w-100 rounded-4 shadow-sm gallery-media"
                    allowFullScreen
                  ></iframe>
                </div>

                <p className="mt-2 fw-semibold">
                  {vid.title} • {vid.duration}
                </p>
                <small className="text-muted">{vid.description}</small>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default GalleryDetails;
