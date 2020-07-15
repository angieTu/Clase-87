import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const STYLES_COLOR = {
  Gryffindor: "rgb(234, 139, 139)",
  Ravenclaw: "rgb(171, 171, 230)",
  Slytherin: "rgb(158, 240, 158)",
  Hufflepuff: "rgb(240, 240, 137)",
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Card = styled.div`
  width: 37vh;
  height: 46vh;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid grey;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #80808017;
  line-height: 0px;

  &.selected {
    transform: scale(1.5);
  }
  & > h4 {
    line-height: 0px;
    margin: 5px;
  }
  & > p {
    font-size: 10px;
    font-weight: bold;
    line-height: 0px;
  }
`;
const Image = styled.img`
  width: 150px;
  height: 150px;
`;

const Filters = styled.div``;

const Button = styled.button`
  backgroundcolor: ${STYLES_COLOR["value"]};
`;

function App() {
  const API_KEY =
    "$2a$10$eCnp5GiM9ke45yXKHkYOhet/kD8D57asDeAxtl86VYjGCeh73CGe6";

  const [characters, setCharacters] = useState([]);
  const [images, setImages] = useState([]);
  const [actualCharacter, setActualCharacter] = useState();
  const [selectedHouse, setSelectedHouse] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    axios
      .get(`https://www.potterapi.com/v1/characters?key=${API_KEY}`)
      .then((response) => setCharacters(response.data));
  }, []);

  useEffect(() => {
    axios
      .get("http://hp-api.herokuapp.com/api/characters")
      .then((response) => setImages(response.data));
  }, []);

  useEffect(() => {
    axios
      .get("https://www.potterapi.com/v1/sortingHat")
      .then((response) => setSelectedHouse(response.data));
  }, [selectedHouse]);

  const handleClick = () => setSelectedHouse("");

  const handleSelectedStatusClick = (event) =>
    setStatusFilter(event.target.value);

  const filterByHouse = (character) => {
    return statusFilter === "All" ? true : character.house === statusFilter;
  };

  return (
    <>
      <Filters>
        <Button value={"Gryffindor"} onClick={handleSelectedStatusClick}>
          Gryffindor
        </Button>
        <Button value={"Hufflepuff"} onClick={handleSelectedStatusClick}>
          Hufflepuff
        </Button>
        <Button value={"Ravenclaw"} onClick={handleSelectedStatusClick}>
          Ravenclaw
        </Button>
        <Button value={"Slytherin"} onClick={handleSelectedStatusClick}>
          Slytherin
        </Button>
        <Button value={"All"} onClick={handleSelectedStatusClick}>
          All
        </Button>
      </Filters>
      <Container>
        {characters.filter(filterByHouse).map((character, index) => (
          <Card
            style={{ backgroundColor: `${STYLES_COLOR[character.house]}` }}
            key={index}
            onClick={() => setActualCharacter(index)}
            className={actualCharacter === index && "selected"}
          >
            {images.map(
              (image, index) =>
                image.name === character.name && (
                  <Image key={index} src={image.image} alt="" />
                )
            )}
            <h3>{character.name}</h3>
            <h4>{character.house}</h4>
            {actualCharacter === index && (
              <>
                <p>Species:{character.species}</p>
                <p>Patronus:{character.patronus}</p>
                <p>Blood Status:{character.bloodStatus}</p>
                <p>Alias:{character.alias}</p>
              </>
            )}
          </Card>
        ))}
        <Container>
          <Button onClick={handleClick}>Which house are you in?</Button>
          <p>{selectedHouse}</p>
        </Container>
      </Container>
    </>
  );
}

export default App;
