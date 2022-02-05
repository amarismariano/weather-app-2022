import React from 'react'
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import useCityList from './../../hooks/useCityList'
import CityInfo from './../CityInfo'
import Weather from './../Weather'
import { getCityCode } from './../../utils/utils'
import { useWeatherDispatchContext, useWeatherStateContext  } from '../../WeatherContext'



const  CityListItem = React.memo(({city, countryCode, country, eventOnClickCity, weather}) =>{
    return (
        <ListItem
            button
            onClick={() => eventOnClickCity(city, countryCode)} >
            <Grid container 
                justify="center"
                alignItems="center"
            >
                <Grid item
                    md={9}
                    xs={12}>
                    <CityInfo city={city} country={country} />
                </Grid>
                <Grid item
                    md={3}
                    xs={12}>
                    <Weather 
                        temperature={weather && weather.temperature} 
                        state={weather && weather.state} /> 
                </Grid>
            </Grid>
        </ListItem>
    )
})

const renderCityAndCountry = eventOnClickCity => (cityAndCountry, weather) => {
    const { city, countryCode } = cityAndCountry
    
    return <CityListItem 
        key={getCityCode(city, countryCode)}  
        eventOnClickCity={eventOnClickCity} 
        weather={weather} 
        {...cityAndCountry} 
    />
    
}

const CityList = ({ cities, onClickCity }) => {
    const actions = useWeatherDispatchContext()
    const data = useWeatherStateContext()

    const { allWeather } = data
    const { error, setError } = useCityList(cities, allWeather, actions)
    
    return (
        <div>
            {
                error && <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
            }
            <List>
                {
                    cities.map(cityAndCountry => renderCityAndCountry(onClickCity)(cityAndCountry, 
                        allWeather[getCityCode(cityAndCountry.city, cityAndCountry.countryCode)]))
                }
            </List>
        </div>

    )
}

CityList.propTypes = {
    cities: PropTypes.arrayOf(
        PropTypes.shape({
            city: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
            countryCode: PropTypes.string.isRequired,
        })
    ).isRequired,
    onClickCity: PropTypes.func.isRequired,
}

export default React.memo(CityList)
