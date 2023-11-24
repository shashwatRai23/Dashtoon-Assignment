import React, { useState } from "react";
import { Box, Input } from "@chakra-ui/react";
import { Button} from "@chakra-ui/react";
import { Card, CardBody } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import "./style.css";
import toast from 'react-hot-toast';
import Carousel from "./Carousel";

async function query(data) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        Accept: "image/png",
        Authorization:
          "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return URL.createObjectURL(result);
}

function App() {
  const [inputs, setInputs] = useState([
    { text: "", image: null, loading1: false, loading2: true },
  ]);
  const [generate, setGenerate] = useState(false);
  const handleChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index].text = event.target.value;
    setInputs(newInputs);
  };

  const handleSubmit = async (index, event) => {
    event.preventDefault();
    const newInputs = [...inputs];
    newInputs[index].loading1 = true;
    setInputs(newInputs);
    try {
      const image = await query({ inputs: inputs[index].text });
      newInputs[index].image = image;
      newInputs[index].loading2 = false;
      newInputs[index].loading1 = false;
      setInputs([...newInputs]);
      toast.success("Image fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch the image");
      console.error(error);
      // handle error
    }
  };

  const generateComic = () => {
    setGenerate(true);
  };

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      { text: "", image: null, loading1: false, loading2: true },
    ]);
  };

  return (
    <div>
      <Box fontSize="2em" textAlign="center">
        Dashtoon-Assignment
      </Box>
      <Card
        align="center"
        flexDirection="row"
        justifyContent="center"
        width={[
          "100%", // 0-30em
          "70%", // 30em-48em
          "60%", // 48em-62em
          "60%", // 62em+
        ]}
        margin="1em auto"
        padding="1em"
        gap="1em"
      >
        <Text>
          <b>Description</b>
          <p>This web application is developed using <b>React.js</b> ,used <b>Chakra UI</b> for making it responsive and <b>React-hot-toast</b> to handle errors and notify them.</p>
          <p>In this application we have to provide 10 comic prompts as input and every prompt image will be fetched from the API and then its prompt and the image will be displayed below. After fetching all the images , generate button will appear, which will display carousel of the comic.</p>
        </Text>
      </Card>
      <div>
        {inputs.map((input, index) => (
          <form
            className="form"
            key={index}
            onSubmit={(event) => handleSubmit(index, event)}
          >
            <div className="inp_panel">
              <Input
                variant="outline"
                placeholder="Enter Prompt"
                value={input.text}
                onChange={(event) => handleChange(index, event)}
                colorScheme="teal"
                backgroundColor="white"
              />
              <Button
                isLoading={input.loading1}
                variant="outline"
                colorScheme="teal"
                type="submit"
                backgroundColor="white"
              >
                Submit
              </Button>
            </div>
            <Card
              maxW="sm"
              width={[
                "100%", // 0-30em
                "60%", // 30em-48em
                "60%", // 48em-62em
                "60%", // 62em+
              ]}
              margin="1em auto"
              padding="1em"
              gap="1em"
            >
              <CardBody
                align="center"
                flexDirection="row"
                justifyContent="center"
              >
                {input.image && (
                  <Image
                    src={input.image}
                    alt=""
                    borderRadius="15px"
                    boxSize="300px"
                  />
                )}
                <Stack mt="6" spacing="3">
                  {input.text && (
                    <Text>
                      <div><b>{input.text}</b></div>
                    </Text>
                  )}
                </Stack>
              </CardBody>
            </Card>
          </form>
        ))}
        <div className="add_btn">
          {inputs.length < 10 && (
            <Button
              onClick={handleAddInput}
              isDisabled={inputs.some((input) => input.loading2)}
              width="40%"
              // backgroundColor="white"
            >
              Add Input Field
            </Button>
          )}
        </div>
      </div>
      {inputs.length === 10 && (
        <div className="add_btn">
          <Button onClick={generateComic} colorScheme="teal" width="40%">
            Generate
          </Button>
        </div>
      )}
      {generate &&
        <Carousel inputs={inputs}/>
      }
    </div>
  );
}

export default App;
