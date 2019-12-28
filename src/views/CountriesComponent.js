import React, {  useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Container,
  Input, 
  Form,
  FormGroup,
  Label,
  Row,
  Col
} from "reactstrap";
import ServerModal from './ServerModal';
import CountryModal from './CountryModal';
import axios from 'axios';
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css"; // import css
import Lottie from 'react-lottie';
import {COUNTRIES_API_URL} from '../services/config';

function CountriesComponent() {
    //api requests hooks
    const [serverLoading, setServerLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [filterOption, setFilterOption] = useState("all");
    const [searchParams, setSearchParams] = useState("");
    const [countryData, setCountryData] = React.useState(null);
    //modals hooks
    const [serverModal, setServerModal] = React.useState(false);
    const [countryModal, setCountryModal] = React.useState(false);
    //pagination hooks and fields
    const [page, setPage] = React.useState(1);
    const pageSize = 9;
    const [totalPages, setTotalPages] = React.useState(10);
  
    // API request get all countries
    const getAllCountries = ()=>{
        setServerLoading(true);
        setPage(1);
        var requestUrl = `${filterOption}/${searchParams}`
        if(filterOption === "all"){
            requestUrl ='all?fields=name;capital;currencies;region;flag;languages;alpha2Code'
        }
        axios({
            method: 'get',
            url:`${COUNTRIES_API_URL}/${requestUrl}`
        })
        .then((response)=> {
               setCountries(response.data)
               setTotalPages(response.data.length)
        })
        .catch((error)=>{
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setServerModal(true)
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
              console.log(error.config);
        })
        .finally(()=> setServerLoading(false))
    }

    //API server request country#show
    const getCountry = (code) =>{
        setServerLoading(true);
        axios({
            method: 'get',
            url:`${COUNTRIES_API_URL}/alpha/${code}`
        })
        .then((response)=> {
            setCountryData(response.data)
            console.log(response)
        })
        .catch((error)=>{
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setServerModal(true)
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
              console.log(error.config);
        })
        .finally(()=>{
            setServerLoading(false); 
            setCountryModal(true);
        })

    }
    //lottie loader options 
    const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: require('../animations/loader.json'),
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice'
		}
    };

    //onchange searchinput
    const onChangeSearch = (event)=>{
        setSearchParams(event.target.value)
    }
    //onchange select
    const onChangeSelect = (event)=>{
        setFilterOption(event.target.value)
    }
    //select filter options
    const filterOptions = [
        {name: "All", value: "all"},
        {name: "Language", value: "lang"},
        {name: "Continent", value: "region"},
        {name: "Name", value: "name"},
        {name: "Capital City", value: "capital"},
        {name: "Calling Code", value: "callingcode"},
    ]
    //server modal toggle
    const toggleModal = () => {
        setServerModal(!serverModal);
      };
    //country modal toggle
    const toggleCountryModal = () => {
        setCountryModal(!countryModal);
    };

    //pagination
    const changeCurrentPage = (page)=>{
        setPage(page)
    }
      
    return(
        <Container>
         <h2 className="title">Country Searcher</h2>
            <Form>
                <Row form className = "d-flex justify-content-center">
                    <Col md={3}>
                        <FormGroup>
                            <Label className = "text-white"
                             for="options_select">Search Options</Label>
                            <Input type="select" name="options_select"
                             id="options_select"
                             onChange= {(event)=> onChangeSelect(event)}
                             value = {filterOption}>
                                 {filterOptions.map(item => (
                                    <option key={item.value} value={item.value}>
                                    {item.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    {filterOption !== "all" && <Col md={3}>
                    <FormGroup>
                        <Label className = "text-white" 
                        for="search">Search</Label>
                        <Input
                        type="search"
                        name="search"
                        id="search"
                        onChange = {(event)=> onChangeSearch(event)}
                        placeholder="Enter you search params..."
                        />
                    </FormGroup>
                        </Col>
                    }
                    <Col md={3}>
                        <FormGroup className = "">
                            <Button className="btn-round" color="primary" 
                                outline style = {{marginTop: "1.8rem"}}
                                disabled = {serverLoading}
                                onClick = {()=> getAllCountries()}>
                                <i className="fa fa-globe" />
                                Search
                            </Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        <Row>
            {countries.slice((page - 1) * pageSize, page * pageSize)
                .map((element, index)=>{
                 return(     
                    <Col md="4" key= {index}>
                        <Card className="card-profile card-plain">
                            <div className="card-avatar">
                            <a href="#pablo" onClick={e => e.preventDefault()}>
                                <img
                                alt="..."
                                src={element.flag}
                                />
                            </a>
                            </div>
                            <CardBody>
                                <div className="author">
                                <CardTitle tag="h4">{element.name}</CardTitle>
                                <h6 className="card-category">Capital City: {element.capital}</h6>
                                <h6 className="card-category">Continent: {element.region}</h6>
                                </div>
                            <p className="card-description title-uppercase text-center">
                                Languages:{element.languages.map((element, index)=> element.iso639_1 && ` ${element.iso639_1}`)}
                            </p>
                            <p className="card-description text-center">
                                Currencies:{element.currencies.map((element, index)=> element.code && ` ${element.code}`)}
                            </p>
                            </CardBody>
                            <CardFooter className="text-center">
                            <Button
                                className="btn  btn-success"
                                onClick={()=> getCountry(element.alpha2Code)}
                            >
                                Check Details
                            </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                    )
                })
            }
            {/* PAGINATION COMPONENT */}
           {countries.length > 0 && <Col md = {12}>
            <Pagination
                currentPage={page}
                totalSize={totalPages}
                sizePerPage={pageSize}
                changeCurrentPage={changeCurrentPage}
                theme="bootstrap"
            />
            </Col>}
        </Row>
            {serverLoading && <Lottie options={defaultOptions} height={300} width={300} style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%) translateY(-50%)',
                            top: '50%'
                        }}/>}
                        <ServerModal isOpen = {serverModal}
                                     toggleModal = {toggleModal} />

                        {countryData && <CountryModal isOpen = {countryModal}
                        toggleModal = {toggleCountryModal}
                        data = {countryData} />}
      </Container>
    );
}

export default CountriesComponent;
