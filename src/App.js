import React, { useState } from "react";
import { Box, Input } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Card, CardBody } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import "./style.css";
import toast from 'react-hot-toast';
import Carousel from "./Carousel";

// Function to query the API for fetching images based on the input text
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
  // State for input fields, images, and loading indicators
  const [inputs, setInputs] = useState([
    { text: "", image: null, loading1: false, loading2: true },
  ]);
  const [generate, setGenerate] = useState(false);

  // Function to handle changes in the input fields
  const handleChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index].text = event.target.value;
    setInputs(newInputs);
  };

  // Function to handle form submission (fetching image based on input)
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
      // Handle error
    }
  };

  // Function to set the flag for generating the comic
  const generateComic = () => {
    setGenerate(true);
  };

  // Function to add new input fields
  const handleAddInput = () => {
    setInputs([
      ...inputs,
      { text: "", image: null, loading1: false, loading2: true },
    ]);
  };

  return (
    <div>
      {/* Header */}
      <Box fontSize="2em" textAlign="center">
        Dashtoon-Assignment
      </Box>
      
      {/* Description */}
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
          <p>
            This web application is developed using <b>React.js</b>, using <b>Chakra UI</b> for responsiveness, and <b>React-hot-toast</b> for error handling and notifications.
          </p>
          <p>
            Users provide 10 comic prompts as input, and images for each prompt are fetched from the API. The prompt and image are displayed below. Once all images are fetched, the 'Generate' button appears to display a carousel of the comic.
          </p>
        </Text>
      </Card>
      
      {/* Input Forms */}
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
        
        {/* Button to add more input fields */}
        <div className="add_btn">
          {inputs.length < 10 && (
            <Button
              onClick={handleAddInput}
              isDisabled={inputs.some((input) => input.loading2)}
              width="40%"
            >
              Add Input Field
            </Button>
          )}
        </div>
      </div>
      
      {/* Button to generate comic */}
      {inputs.length === 10 && (
        <div className="add_btn">
          <Button onClick={generateComic} colorScheme="teal" width="40%">
            Generate
          </Button>
        </div>
      )}
      
      {/* Display the carousel after generating */}
      {generate &&
        <Carousel inputs={inputs}/>
      }
    </div>
  );
}

export default App;
