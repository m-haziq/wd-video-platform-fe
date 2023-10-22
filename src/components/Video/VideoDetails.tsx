import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import useVideo from "../../hooks/useVideo";
import { Rating } from "react-simple-star-rating";
import "./VideoDetail.css";
import Header from "../Header/Header";

interface IRating {
  id: number;
  rating: number;
}
interface ITag {
  id: number;
  name: string;
}
interface IVideo {
  id: number;
  title: string;
  description: string;
  url: string;
  tags: ITag[];
  ratings: IRating[];
}

const VideoDetail: React.FC = () => {
  const { id } = useParams();
  const { videos } = useVideo() || { videos: [] };
  const idNumber = Number(id);
  const paramVideo = videos.find((video: IVideo) => video.id === idNumber);
  if (!paramVideo) {
    return <div>No matching video found</div>;
  }

  return (
    <>
      <Header />
      <Container fluid="md" className={"ContainerStyle"}>
        <Row className="m-auto align-self-center">
          <Col xs={12} sm={12} md={12} lg={12} className="ColStyle">
            <Card className="CardStyleDetail">
              <div>
                <iframe
                  src={`https://www.youtube.com/embed/${
                    paramVideo.url.split("v=")[1].split("&")[0]
                  }`}
                  allow="autoplay; encrypted-media"
                  title="video"
                  className="detailComponentStyle"
                />
              </div>

              <Card.Body>
                <Card.Title>{paramVideo.title}</Card.Title>

                <div> {paramVideo.description}</div>
              </Card.Body>
              <Card.Body>
                <div className="d-flex" style={{ flexWrap: "wrap" }}>
                  {paramVideo.tags.map((tag: { name: string }, tagIndex) => (
                    <div key={tagIndex} className="tag me-2">
                      <Badge bg="secondary">{tag.name}</Badge>
                    </div>
                  ))}
                </div>
              </Card.Body>
              <Card.Footer className="text-center">
                {paramVideo.ratings.map((rating, ratingIndex) => (
                  <Rating
                    key={ratingIndex}
                    readonly={rating.rating ? true : false}
                    initialValue={rating?.rating ? rating?.rating : 0}
                    size={30}
                  />
                ))}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VideoDetail;
