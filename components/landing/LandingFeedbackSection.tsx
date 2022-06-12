import React, { Fragment } from 'react';
import Slider from 'react-slick';

import style from '../../static/components/landing/landing-section7.module.css';

const reviewList = [
  {
    image: '/static/images/customer10.jpg',
    name: 'Hillary',
    text: 'I absolutely love how easy these nails are! It was simple applying them. For a gal who is constantly on-the-go, these helped simplify my nails!'
  },
  {
    image: '/static/images/customer11.jpg',
    name: 'Jayme',
    text: 'I have always loved the concept of stick on nails but I always had an issue with them fitting my nails perfectly. (...) I just applied my very first pair last night and omg I could not believe how easy it was and how well they stick'
  },
  {
    image: '/static/images/customer16.jpg',
    name: 'Bonnie',
    text: 'This is definitely my new go-to manicure. I love that I can have beautiful nail art in minutes in the comfort of my own home, and it looks exactly like a gel mani you’d get at a salon!',
  },
  {
    image: '/static/images/customer13.jpg',
    name: 'Erin',
    text: "I'm pregnant and want to avoid as many chemicals as possible, but I still love my nails painted! ManiMe gives me the best of both worlds --- non toxic and cute nails!"
  },
  {
    image: '/static/images/customer12.jpg',
    name: 'Jenn',
    text: "Overall, this is a total game changer! (...) I tried them for the first time before going out to dinner and I got compliments in line in the ladies' room!"
  },
  {
    image: '/static/images/customer15.jpg',
    name: 'Gena',
    text: 'So much faster and cheaper than going to the nail salon! (...) I save time and money and my Manime lasts almost as long.(...) Have already placed my second order. Love these nails.',
  },
  {
    image: '/static/images/customer14.jpg',
    name: 'Rita',
    text: 'These are the best! Manicures never last more than 7 days for me. I finally took these off on day 14.',
  },
  {
    image: '/static/images/customer4.jpg',
    name: 'Michelle',
    text: "ManiMe is officially my new go-to beauty product. Navigating my new role of working-mom hasn't been easy, but ManiMe makes it better. I love feeling polished without having to commit the time (and money) this look typically requires.",
    fontSize: 15
  },
  {
    image: '/static/images/customer6.jpg',
    name: 'Aprajita',
    text: 'My last ManiMe set lasted over two weeks without a single chip or scratch and even then I only took it off because I wanted to try a new set. Voila!'
  },
  {
    image: '/static/images/customer3.jpg',
    name: 'Lizzie',
    text: 'I absolutely love my ManiMe stick ons! I travel for work and it’s so great to be able to give myself a stylish manicure in minutes!',
  },
];

const settings = {
  className: style.slider,
  dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 2,
  slidesToScroll: 1,
  // adaptiveHeight: true,
  // centerMode: true,
  // autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        // infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        // infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        //initialSlide: 1,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const LandingFeedbackSection = () => (
  <div className={style.container}>
    <div className={style.mobileTextPanel}>THE VOICE OF <br /> MANIOTHERS</div>
    <div className={style.textPanel}>
      THE VOICE OF<br /> MANIOTHERS
    </div>
    <Slider
      {...settings}
    >
      {reviewList.map((item, index) => (
        <div key={index} className={style.item} >
          <img className={style.userImage} src={item.image} alt='manime-review' />
          <div className={style.reviewPanel}>
            <div style={{fontSize: `${item.fontSize || 16}px`}}>"{item.text}"<br /></div>
            <div className={style.name}>{item.name}</div>
          </div>
        </div>
      ))}
    </Slider>
  </div>
);

export default LandingFeedbackSection;