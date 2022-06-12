export default function UserCircle(props: {width?, height?, stroke?, strokeWidth?, fill?}){
  return  (

<svg  width={props.width ||"26"} height={props.height ||"26"} viewBox="0 0 26 26">
    <defs>
        <rect id="r92lp55uva" width={ 25.3 } height={23.3} x="0" y="0" rx="12.65"/>
    </defs>
    <g fill={props.fill ||"none"} fillRule="evenodd">
        <g>
            <g>
                <g transform="translate(-26 -256) translate(17 208) translate(9 48)">
                    <mask id="99703qzqqb" fill={props.fill ||"#fff"}>
                        <use href="#r92lp55uva"/>
                    </mask>
                    <rect width="23.575" height="23.575" x=".863" y=".863" stroke={props.stroke || "#F7BFA0" } strokeWidth={props.strokeWidth || "1.725"} rx="11.787"/>
                    <g fillRule="nonzero" stroke={props.stroke || "#F7BFA0"} strokeWidth={props.strokeWidth || "1.51"} mask="url(#99703qzqqb)">
                        <g transform="translate(3.45 6.9)">
                            <rect width="7.823" height="8.282" x="5.421" y=".755" rx="3.912"/>
                            <path d="M5.6 23.467c4.851 6.448 13.066-.965 13.066-1.358 0-4.467-4.178-9.656-9.333-9.656C4.18 12.453 0 16.776 0 22.109c0 .506 6.356 3.704 9.632 1.358"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>

  )
}


