import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import axios from "axios";
import useResourceAddToCart from "../hooks/useResourceAddToCart";
import useResourceAddCart from "../hooks/useResourceAddCart";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { useAuth } from "../contexts/auth";
import jwt from "jsonwebtoken";
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import Head from "next/head";
export default function Supplies() {
  const { createResource } = useResourceAddToCart();
  const { resources, createResourceCart } = useResourceAddCart();
  const [supplies, setSupplies] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState([]);
  const [order, setOrder] = useState([]);


  useEffect(() => {
    let acctoken = localStorage.getItem("access");
    const decodedAccess = jwt.decode(acctoken);
    console.log(decodedAccess);
    setUser(decodedAccess);
    console.log(resources);
  }, [resources]);


  // useEffect(() => {
  //   if (resources){
  //     setOrder( resources)
  //     console.log(order);
  //   }
  // }, [resources,order])

  useEffect(async () => {
    const url = "https://pets-api-v1.herokuapp.com/api/v1/supplies/";
    try {
      const response = await axios.get(url);
      // setSupplies(previousState =>...pervious)
      const data = response.data;
      setSupplies(data);
      //   console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);




  const addToCart = (item) => {
    let orderExist = false
    let cartNum

    if (user) {
      const cartData = {
        owner: user.user_id,
        ref_code: user.username + " " + user.user_id,
      };
      let count


      resources.map((item) => {
        count = parseInt(item.id)
        count += 1

        if (item.owner == user.user_id) {
          console.log(item.id);
          cartNum = item.id
          orderExist = true

        }
      })
      const objToAddINCart = {
        "product_id": item.id,
        "order": cartNum
      }
      if (!orderExist) {
        createResourceCart(cartData).then((response) => {
          if (cartNum) {
            console.log(count);
            createResource(objToAddINCart)
          }
          else {
            console.log("else" + count);

            const objToAddINCart = {
              "product_id": item.id,
              "order": count
            }
            createResource(objToAddINCart)

          }

        })


      }
      else {
        createResource(objToAddINCart)
      }

    }
    localStorage.setItem("cartNum", cartNum);
  };

  return (
    <div className="supplies mancolbg">
      <Head>
        <title>Supplies</title>
        <link rel="icon" href="/logo.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
        />
        <link
          rel="stylesheet"
          href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
        />
      </Head>
      <header className="h-64 mx-auto mb-32 rounded xl:container max-h-16">
        <Nav />
      </header>
      <main className="mx-auto xl:container max-width:1280px mancolbg">
        <h1 className="grid mt-5 text-2xl text-white text-grey-darkest justify-items-center">Here you will find what the pet needs </h1>
        <div className="grid grid-cols-3 justify-items-center">
          {supplies.map((item) => {
            return (
              <Card
                sx={{ maxWidth: 320, maxHeight: 540 }}
                className="mx-10 my-10 bg-gray-200 cardsup"
              >
                <CardActionArea>
                  <CardMedia
                    name="picture"
                    component="img"
                    image={item.picture}
                    style={{ height: "12rem", width: "12rem", marginLeft: "4rem", marginTop: '2rem' }}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      name="name"
                      

                    >
                      {item.product_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ width: "18.5rem", height: "7rem",  }}
                      name="discription"
                    >
                      {item.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      name="price"
                      

                    >
                      Price : {item.price} JD
                    </Typography>
                    <Stack spacing={1}>
                      <Rating
                        name="half-rating-read"
                        defaultValue='4.5'
                        precision={item.precision}
                        readOnly

                      />
                    </Stack>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  {user&&<Button
                    onClick={() => addToCart(item)}
                    size="small"
                    color="primary"
                  >
                    Add To Cart
                  </Button>}
                  
                </CardActions>
              </Card>
            );
          })}

        </div>
      </main>
      <footer className="pt-16 ">
        <Footer />
      </footer>
    </div>
  );
}
