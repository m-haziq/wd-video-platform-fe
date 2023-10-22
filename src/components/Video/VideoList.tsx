import Badge from "react-bootstrap/Badge";
import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import {
  Form,
  FormControl,
  Container,
  Row,
  Col,
  Card,
  Button,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import useVideo from "../../hooks/useVideo";
import "./VideoList.css";
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

const VideoList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IVideo[]>([]);
  const { filterSearch, sortSearch, removeVideo, updateReview } =
    useVideo() || { videos: "" };
  const { videos } = useVideo() || { videos: [] };
  const [sortingOrder, setSortingOrder] = useState<
    | "Title (A-Z)"
    | "Title (Z-A)"
    | "Creation Date (Latest First)"
    | "Creation Date (Oldest First)"
    | "Rating (Highest First)"
    | "Rating (Lowest First)"
  >("Title (A-Z)");

  const MAX_DESCRIPTION_LENGTH = 100;

  const handleRating = (rate: number, id: number) => {
    const updatedData = filteredData.map((item) => {
      if (item.id === id) {
        item.ratings = [
          {
            id: Date.now(),
            rating: rate,
          },
          ...(item.ratings || []),
        ];
      }
      return item;
    });

    setFilteredData(updatedData);
    updateReview?.(rate, id);
  };

  const handleSortingSelect = (
    order:
      | "Title (A-Z)"
      | "Title (Z-A)"
      | "Creation Date (Latest First)"
      | "Creation Date (Oldest First)"
      | "Rating (Highest First)"
      | "Rating (Lowest First)"
  ) => {
    setSortingOrder(order);
    if (sortSearch) {
      sortSearch(order);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    if (filterSearch) {
      filterSearch(searchValue);
    }
  };
  const handlesubmit = (videoId: number) => {
    removeVideo?.(videoId);
  };

  function TruncateDescription({ description }: { description: string }) {
    const truncatedDescription =
      description.length > MAX_DESCRIPTION_LENGTH
        ? description.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
        : description;

    return (
      <Card.Text className="description">{truncatedDescription}</Card.Text>
    );
  }

  return (
    <div className="App">
      <Container fluid="md" className={"ContainerStyle"}>
        <Row className="m-auto align-self-center">
          <Col xs={12} sm={6} md={4} lg={5} className="SearchStyle">
            <Form>
              <FormControl
                type="text"
                placeholder="Search videos..."
                onChange={handleSearchInputChange}
                value={searchTerm}
              />
            </Form>
          </Col>
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={7}
            className="d-flex justify-content-end"
          >
            <Dropdown>
              <Dropdown.Toggle variant="success" id="sorting-dropdown">
                Sorting Order:{" "}
                {sortingOrder.charAt(0).toUpperCase() + sortingOrder.slice(1)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handleSortingSelect("Title (A-Z)")}
                >
                  Title (A-Z)
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortingSelect("Title (Z-A)")}
                >
                  Title (Z-A)
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    handleSortingSelect("Creation Date (Latest First)")
                  }
                >
                  Creation Date (Latest First)
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    handleSortingSelect("Creation Date (Oldest First)")
                  }
                >
                  Creation Date (Oldest First)
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortingSelect("Rating (Highest First)")}
                >
                  Rating (Highest First)
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortingSelect("Rating (Lowest First)")}
                >
                  Rating (Lowest First)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row className="m-auto align-self-center">
          {videos?.length > 0
            ? videos?.map((video, index) => (
                <Col
                  key={index}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className="ColStyle"
                >
                  <Card className="CardStyle">
                    <div>
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          video.url.split("v=")[1].split("&")[0]
                        }?vq=hd360`}
                        allow="autoplay; encrypted-media"
                        title="video"
                        className="myComponentStyle"
                      />
                    </div>
                    <div className="not-intrested-button">
                      <div>
                        <Card.Title className="Title">{video.title}</Card.Title>
                      </div>
                      <Button
                        variant="outline-danger"
                        onClick={() => handlesubmit(video.id)}
                      >
                        Not Interested
                      </Button>
                    </div>
                    <Link to={`/dashboard/${video?.id}`} className="Link-style">
                      <Card.Body>
                        <TruncateDescription description={video.description} />
                      </Card.Body>
                      <Card.Body>
                        <div className="d-flex" style={{ flexWrap: "wrap" }}>
                          {video.tags.map((tag: { name: string }, tagIndex) => (
                            <div key={tagIndex} className="tag me-2">
                              <Badge bg="secondary">{tag.name}</Badge>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Link>
                    <Card.Footer className="text-center">
                      <Rating
                        readonly={video.ratings.length ? true : false}
                        onClick={(rate: number) => handleRating(rate, video.id)}
                        initialValue={
                          video.ratings.length > 0 ? video.ratings[0].rating : 0
                        }
                        size={30}
                      />
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            : "No video found"}
        </Row>
      </Container>
    </div>
  );
};
export default VideoList;
