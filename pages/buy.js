import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Container from '@mui/material/Container';
import Nav from "../components/Nav";
import PetsForm from '../components/PetsForm';
import Button from '@mui/material/Button';
import axios from 'axios'
import useResource from '../hooks/useResource'
import jwt from 'jsonwebtoken';
import { storage } from '../firebase'
import Footer from '../components/Footer';
import Head from "next/head";
import { fontSize } from '@mui/system';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PetsIcon from '@mui/icons-material/Pets';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import PetsFormUpdate from '../components/PetsFormUpdate';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Home() {








    const [imageurl, setImageurl] = useState('');
    const handleInputChange = (e) => {

        let image = e.target.files[0]
        let pathReference = storage.ref(`images/${image.name}`)

        const uploadTask = pathReference.put(image).then((url) => {
            pathReference.getDownloadURL().then((url) => {
                console.log(url);
                setImageurl(url)
            })
        });

    }


    const { resources, loading, createResource, deleteResource, updateResource } = useResource();
    const [user, setUser] = useState([])
    const [pets, setPets] = useState([])
    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/pet/'
        let acctoken = localStorage.getItem("access");
        const decodedAccess = jwt.decode(acctoken);
        console.log(decodedAccess);
        setUser(decodedAccess)
    }, [])

    useEffect(() => {
        if (resources) {
            setPets(resources)
        }
    }, [resources, pets])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console
        console.log({
            type: data.get('type'),
            price: data.get('price'),
            description: data.get('description'),
            picture: imageurl,

        });
        const newPet = {

            'type': data.get('type'),
            'picture': imageurl,
            'description': data.get('description'),
            'price': data.get('price'),
            'name_pet': data.get('name'),
            'adopt': 'false',
            'user_id': user.user_id,
        }
        createResource(newPet)
        handleClose()
    };
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        if (user) {
            setOpen(true);
        }
        else {
            alert('please login first')
        }
    }
    const handleClose = () => setOpen(false);


    const [openUpdate, setOpenUpdate] = useState(false);
    const handleCloseUpdate = () => setOpenUpdate(false);
    const [updateData, setupdateData] = useState([])
    const handleupdate = (item) => {

        console.log(item)
        setupdateData(item)
        setOpenUpdate(true)
        console.log(updateData)


    }



    return (

        <div className='mancolbg' >
            <Head>
                <title>pets</title>
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

            <header className="h-64 mx-auto mb-6 rounded xl:container max-h-16">
                <Nav />
            </header>

            <main className="mx-auto xl:container max-width:1880px mancolbg ">
                <div className='m-auto mt-12 align-middle w-72'>
                    <button className="inline-block px-4 py-2 mt-10 font-semibold text-green-500 border-2 border-green-500 rounded-md hover:bg-green-700 hover:text-white hover:border-green-700 focus:outline-none focus:ring focus:ring-green-100" onClick={handleOpen}>You Have an offer??  add it!!</button>
                    <PetsFormUpdate open={openUpdate} datafrom={updateData} handleClose={handleCloseUpdate} />
                    <PetsForm open={open} handleClose={handleClose} handleInputChange={handleInputChange} handleSubmit={handleSubmit}
                    />
                </div>
                <div>

                    {pets.slice(0).reverse().map((item) => {
                        return (
                            <Container className='relative' >
                                <Card sx={{ maxWidth: 1000 }} className='p-5 my-10 bg-gray-200 rounded-lg' >
                                    <div>
                                        <CardHeader
                                            sx={{

                                            }}
                                            avatar={
                                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">

                                                    {item.user.user_name[0] + item.user.user_name[1]}
                                                </Avatar>
                                            }

                                            title={item.user.first_name + ' ' + item.user.last_name}
                                            subheader={item.published.substring(0, 10)}
                                        />

                                    </div>
                                    <div className='flex'>
                                        <img src={item.picture} alt="Paella dish"  className='max-w-md' />
                                        {/* <CardMedia
                                            component="img"
                                            
                                            image={item.picture}
                                            alt="Paella dish"
                                            
                                            

                                        /> */}
                                        <div className='w-96'>
                                            <CardContent>
                                                <Typography className='text-xl font-semibold' >
                                                    <FormatColorTextIcon /> name: {item.name_pet}<br />
                                                    <PetsIcon />     type : {item.type}  <br />
                                                    <div className='flex'>
                                                        <MonetizationOnIcon />
                                                        {item.price == 0 ? <p> &nbsp;for adoption </p> : <p>   Price: {item.price}</p>}
                                                    </div>
                                                    {/* <PhoneIcon/> Phone number: {item.user.phone} */}
                                                </Typography>
                                            </CardContent>

                                            <CardContent>
                                                <Typography className='text-xl font-semibold' >

                                                    <NoteAltIcon /> Description

                                                </Typography>
                                                <Typography className='ffeerraass' style={{ width: '25rem', maxHeight: '50rem' }} paragraph={true} nowrap={false} >
                                                    {item.description} <br/>

                                                </Typography>

                                            </CardContent>


                                        </div>
                                        <div>
                                            {user && user.user_id == item.user.id ? <button className="absolute inline-block px-4 py-2 font-semibold text-red-500 border-2 border-red-500 rounded-md bottom-2 right-48 hover:bg-red-700 hover:text-white hover:border-red-700 focus:outline-none focus:ring focus:ring-red-100" onClick={() => deleteResource(item.id)} >Delete</button> : <p></p>}
                                            {user && user.user_id == item.user.id ? <button className="absolute inline-block px-4 py-2 font-semibold text-blue-500 border-2 border-blue-500 rounded-md bottom-2 right-72 hover:bg-blue-700 hover:text-white hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-100" onClick={() => handleupdate(item)} >update</button> : <p></p>}




                                        </div>


                                    </div>

                                </Card>
                            </Container>
                        )
                    })}
                </div>
            </main>

            <footer className="pt-16 ">
                <Footer />
            </footer>




        </div>
    )
}