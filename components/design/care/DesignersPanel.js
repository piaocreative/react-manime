import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { pageLinks } from '../../../utils/links';
import style from './css/designers-panel.module.css';

const designers = [
  {
    firstName: 'Alicia',
    lastName: 'Torello',
    description: "Master of real-life graphic motifs and precise, camera-ready designs.",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/alicia-torello1.jpg',
    link: pageLinks.Designer['Alicia Torello'].url,
    productId: '4705981202541',
  },
  {
    firstName: 'Amy',
    lastName: 'Le',
    description: "Nail artist combing classic and bold styles, famous for her detailed, hand-drawn custom nail design. ",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/amy-le.jpg',
    link: pageLinks.Designer['Amy Le'].url,
    productId: '4705981726829',
  },
  {
    firstName: 'Cassandre',
    lastName: 'Marie',
    description: "Editorial nail artist and photographer specializing in geometric forms and mesmerizingly straight lines.",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/cassandre-marie.jpg',
    link: pageLinks.Designer['Cassandre Marie'].url,
    productId: '4705982283885',
  },
  {
    firstName: 'Eda',
    lastName: 'Levenson',
    description: "Creative Director of Lady Fancy Nails known for eye-catching nail art and work for increased diversity  in the creative industry.",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/eda-levenson1.jpg',
    link: pageLinks.Designer['Eda Levenson'].url,
    productId: '4705982578797'
  },
  {
    firstName: 'Hang',
    lastName: 'Nguyen',
    description: "Classically trained artist and mother known for her floral and negative space nail art designs.",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/hang-nguyen.jpg',
    link: pageLinks.Designer['Hang Nguyen'].url,
    productId: '4705982972013'
  },
  {
    firstName: 'Jessica',
    lastName: 'Washick',
    description: "Exploring the intersection of nail art and sneaker culture as a Nike designer and renown nail artist.",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/jessica-washick1.jpg',
    link: pageLinks.Designer['Jessica Washick'].url,
    productId: '4705983299693',
  },
  {
    firstName: 'Kia',
    lastName: 'Stewart',
    description: "Nail artist and entrepreneur best known for brilliant use of negative space, curves and color-blocking.",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/kia-stewart.jpg',
    link: pageLinks.Designer['Kia Stewart'].url,
    productId: '4716834193517'
  },
  {
    firstName: 'Madeline',
    lastName: 'Poole',
    description: "Experimental, all-around creative artist who’s always innovating and pushing the boundaries.",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/madeline-poole1.jpg',
    link: pageLinks.Designer['Madeline Poole'].url,
    productId: '4705983660141'
  },
  {
    firstName: 'Mimi',
    lastName: 'D',
    description: "Award winning manicurist specializing in clean straight lines, sweet pastel-tone colors and metallics",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/mimi-d.jpg',
    link: pageLinks.Designer['Mimi D'].url,
    productId: '4716835143789'
  },
  {
    firstName: 'Natalie',
    lastName: 'Pavloski',
    description: "Painter and manicurist best known for her wearable chic, minimalist designs.",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/natalie-pavloski1.jpg',
    link: pageLinks.Designer['Natalie Pavloski'].url,
    productId: '4705984184429'
  },
  {
    firstName: 'Spifster',
    lastName: 'Sutton',
    description: "‘Spif-ing’ up nail art with designs that draw innovation from architecture, especially that of Chicago",
    imgUrl: 'https://d1b527uqd0dzcu.cloudfront.net/web/design/designers/spifster-sutton.jpg',
    link: pageLinks.Designer['Spifster'].url,
    productId: '4716832391277'
  },
];

const DesignersPanel = () => {
  
  return (
    <div className={style.container}>
      <div className={style.title}>MEET THE DESIGNERS</div>
      <div className={style.designerList}>
      {designers.map((item, index) => {
        return (
          <div className={style.oneDesigner} key={index}>
            <img
              className={style.designerAvatar}
              src={item.imgUrl} />
            <div className={style.designerName}>
              {`${item.firstName} ${item.lastName}`}
            </div>
            <div className={style.description}>
              {item.description}
            </div>
            <Link href={item.link}>
              <a className={classNames(style.designerLink, style.visible)}>
                {`More about ${item.firstName}`}
              </a>
            </Link>
          </div>
          );
        })
      }
      </div>
    </div>
  );
};

export default DesignersPanel;