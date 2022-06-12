import config from '../config';
import axios from 'axios';

export const getOrderTotal = products => {
    if(!products){
        return 0;
    }

    let orderTotal = products.reduce((acc, currentProduct) => {
        return acc + (currentProduct['price'] * currentProduct['quantity']);
    }, 0)

    return parseFloat(Math.round(orderTotal * 100) / 100).toFixed(2);
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getDateString = dateCreated => {
    try {
        const date = new Date(dateCreated.toString());
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return `${monthNames[monthIndex]} ${day} ${year}`;
    } catch (err) {
        log.info('[getDateString] err =>', err);
        return '';
    }
}

export const isDevMode = () => {
    return process.env.NODE_ENV !== 'production'  && ! (process.env.FORCE_MIXPANEL === 'true');
    // return false;
}

export const getDeliveringDate = async (increment = 3) => {
    const now = new Date;
    const pstStamp = now.getTime() + (now.getTimezoneOffset() * 60000 - 8000 * 60);
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    const compareWith = new Date(year, month, day, 20, 0, 0 ).getTime(); // PST time 12:00 PM

    let start_day = `${year}-${month + 1}-${day}`; // today

    // compare current Time & PST 12:00 PM
    if (pstStamp > compareWith) {
        start_day = `${year}-${month + 1}-${day + 1}`;
    }
    let end_date = start_day;
    const getApi = (start_day, increment) => (`https://api.workingdays.org/1.2/api.php?key=${config.workingDaysApiKey}&country_code=US&configuration=Federal%20holidays&command=add_working_days&start_date=${start_day}&increment=${increment}&nocache=1575600536196`);

    let api = getApi(start_day, 1);

    try {
        const { data }  = await axios.get(api);
        const start_day = data.result.end_date;
        api = getApi(start_day, increment + 1);
        const { data: data2 } = await axios.get(api);
        end_date = data2.result.end_date;
        return end_date;
    } catch (err) {
        log.info('err =>', err);
        return null;
    }


}
