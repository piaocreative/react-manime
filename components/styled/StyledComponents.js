import {
  space,
  height,
  width,
  fontSize,
  color,
  display,
  flex,
  flexWrap,
  flexDirection,
  flexBasis,
  alignSelf,
  justifySelf,
  alignItems,
  justifyContent,
  background,
  backgroundImage,
  backgroundSize,
  backgroundRepeat,
  borderRadius,
  borderColor,
  borders,
  boxShadow,
  opacity,
  overflow,
  position,
  zIndex,
  top,
  left,
  bottom,
  right,
  fontFamily,
  fontWeight,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  size,
} from 'styled-system';
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components';
import Box from './Box';
import style from '../../static/components/styled/StyledComponents.module.css'
export const H1 = styled.h1`
  @media (max-width: 479px) {
    font-size: 18px;
  }
  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}
  cursor: default;
`;

export const Input = styled.input`
  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}

`;


export const TextArea = styled.textarea`

  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}
`;

export const Img = styled.img`
  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}
`;

export const StandardInput = styled(Input)`
  font-family: ${props => {
    return props.theme.fonts?.sansSerif;
  }};
  background-color: ${props => (props.transparent || props.underlined ? 'transparent' : '#fff')};
  border: 1.5px solid ${props => (props.error ? '#FF8181' : '#D8D8D8')};
  border-top: ${props => props.underlined && 'none'};
  border-right: ${props => props.underlined && 'none'};
  border-left: ${props => props.underlined && 'none'};
  border-radius: 0px;
  box-sizing: border-box;
  color: ${props => (props.color || '#152025')};
  height: ${props => (props.height || '40px')};
  margin: 0 0 20px 0;
  padding: 5px 10px;
  font-size: 16px;
  width: 100%;
  &:focus {
    outline: none;
  };
  &::placeholder {
    color: ${props => (props.error && !props.errorText) && '#FF8181'};
  }
`;


export const StandardInputBox = ({ value, error, errorText='', ...rest}) => (
  <StandardInput
    value={value}
    placeholder={error && errorText}
    error={error}
    {...rest}
  />
);

export const StandardTextArea = styled(TextArea)` 
  font-family: ${props => {
    return props.theme.fonts?.sansSerif;
  }};
  resize: ${props => (props.resize || "none")};
  background-color: ${props => (props.transparent || props.underlined ? 'transparent' : '#fff')};
  border: 1.5px solid ${props => (props.error ? '#FF8181' : '#D8D8D8')};
  border-top: ${props => props.underlined && 'none'};
  border-right: ${props => props.underlined && 'none'};
  border-left: ${props => props.underlined && 'none'};
  border-radius: 0px;
  box-sizing: border-box;
  color: ${props => (props.color || '#152025')};
  height: ${props => (props.height || '40px')};
  margin: 0 0 20px 0;
  padding: 5px 10px;
  font-size: 16px;
  width: 100%;
  &:focus {
    outline: none;
  };
  &::placeholder {
    color: ${props => (props.error && !props.errorText) && '#FF8181'};
  }
`;

export const StandardInputField = ({ value, error, errorText='', ...rest}) => (
  <div>
    <StandardInput
      value={value}
      placeholder={error && errorText}
      errorText={errorText}
      error={error}
      {...rest} />
    {error &&
      <div className={style.inputError}>
        <ReactMarkdown source={errorText} />
      </div>
    }
  </div>
);

export const StandardTextAreaField = ({ value, error, errorText='', ...rest}) => (
  <>
    <StandardTextArea
      value={value}
      placeholder={error && errorText}
      errorText={errorText}
      error={error}
      {...rest} />
    {error &&
      <div style={{position: 'relative', height: 'auto', top: '-18px', left: '10px', fontSize: '13px', color: '#FF8181', whiteSpace: 'noWrap', }}>{errorText}</div>
    }
  </>
);

export const Button = styled.button`
  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}
`;

export const StyledStandardButton = styled(Button)`
  font-family: ${props => {
    return props.theme.fonts?.sansSerif;
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => (props.outline ? '#414141' : props.color ? props.color : '#fff')};
  border-radius: 0px;
  font-size: 13px;
  font-weight: 600;
  ${fontSize}
  ${fontWeight}
  transition: easy-out 0.3s;
  border: ${props => (props.outline ? '2px solid #414141' : 'none')};
  white-space: nowrap;
  padding: 0px 40px;
  height: ${props => props.height || '40px'};
  cursor: pointer;
  letter-spacing: ${props => props.letterSpacing || '2px'};
  background-color: ${props =>
    props.disabled ? '#aaa' : props.outline ? 'transparent' : props.backgroundColor ? props.backgroundColor : '#F7BFA0'};
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: ${props =>
      props.disabled ? '#aaa' : props.outline ? '#F7BFA0' : props.backgroundHoverColor ? props.backgroundHoverColor : '#e88f5e'};
    color: ${props => props.color ? props.color : '#fff'};
  }
  &:active {
  }
`;

export const StyledStandardDarkButton = styled(Button)`
  font-family: ${props => {
    return props.theme.fonts?.sansSerif;
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0px;
  font-size: 13px;
  font-weight: 600;
  ${fontSize}
  ${fontWeight}
  border: ${props => (props.outline ? '2px solid #2C4349' : 'none')};
  white-space: nowrap;
  padding: 0px 40px;
  height: ${props => props.height || '40px'};
  cursor: pointer;
  letter-spacing: ${props => props.letterSpacing || '2px'};
  color: ${props => (props.outline ? '#2C4349' : props.color ? props.color : '#fff')};
  background-color: ${props =>
    props.disabled ? '#aaa' : props.outline ? 'transparent' : props.backgroundColor ? props.backgroundColor : '#2C4349'};
  &:focus {
    outline: none;
  }
  &:hover {
    transition: easy-out 0.3s;
    background-color: ${props =>
      props.disabled ? '#aaa' : props.outline ? 'transparent' : props.backgroundColor ? props.backgroundColor : '#35535b'};
  }
`;

export const StandardOutlinedButton = styled(Button)`
  display: ${props => props.display? props.display: 'flex'};  
  justify-content: center;
  align-items: ${props => props.alignItems ? props.alignItems : 'center'};
  align-self: center;
  // min-width: 160px;
  height: ${props => props.height ? props.height : '40px'};
  color: ${props => props.color ? `${props.color}` : '#fa6a00'};
  border-radius: 0px;
  font-size: ${props => props.fontSize ? props.fontSize : '16px'};
  font-weight: 500;
  border: ${props => props.border ? props.border : '1px solid #fa6a00'};
  border-radius: ${props => props.borderRadius ? props.borderRadius : '0px'};
  ${'' /* min-width: 200px; */}
  ${'' /* padding: ${props => props.padding ? props.padding : '0px 20px'}; */}
  background:  ${props => props.background ? props.background : 'transparent'};
  white-space: ${props => props.whiteSpace ? props.whiteSpace : 'nowrap'};
  cursor: pointer;
  letter-spacing: ${props => props.letterSpacing || '2px'};
  flex-grow: 0;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #f9f9f9;
  }
  &:active {
  }
`;

export const StandardButton_2 = styled(Button)`
  display: ${props => (props.display? props.display: 'flex')};
  justify-content: center;
  align-items: ${props => props.alignItems ? props.alignItems : 'center'};
  align-self: center;
  color: ${props => props.color ? props.color : '#000'};
  border-radius: 0px;
  font-size: ${props => props.fontSize ? props.fontSize : '16px'};
  font-weight: 500;
  border: ${props => props.border ? props.border : 'none'};
  border-radius: ${props => props.borderRadius ? props.borderRadius : '0px'};
  ${'' /* min-width: 200px; */}
  ${'' /* padding: ${props => props.padding ? props.padding : '0px 20px'}; */}
  height: ${props => props.height || '40px'};
  background-color: ${props => props.bgColor || '#fff'};
  white-space: ${props => props.whiteSpace ? props.whiteSpace : 'nowrap'};
  cursor: pointer;
  flex-grow: 0;
  &:focus {
    outline: none;
  }
  &:hover {
    opacity: 0.7
    ${'' /* background-color: rgba(240, 240, 240, 0.9); */}
  }
  &:active {
  }
`;

export const SelectionBox = styled(Button)`
  background-color: #fff;
  ${color}
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => (props.color ? props.color : '#000')};
  border-radius: 3px;
  border: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  &:hover {
    ${'' /* background-color: #f3f3f3; */}
    box-shadow: ${props => (!props.description ? props.theme.shadows[10] : 'none')};
    transform: ${props =>
      !props.description ? (props.lg ? 'translateY(-3px)' : 'translateY(-2px)') : 'none'};
  }
`;

export const SelectionBoxImage = styled.img`
  position: absolute;
  max-width: 95%;
  max-height: 95%;
  width: auto;
  &:hover {
    background-color: transparent;
  }
`;

// &:active {
//   box-shadow: ${(props) => !props.description ? '0 5px 10px 0 rgba(0,0,0,0.06)' : 'none'};
//   transform: ${(props) =>  !props.description ? 'translateY(-2px)' : 'none'};
// }

export const Label = styled.label`
  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}
`;

export const StandardLabel = styled(Label)`
  color: #717171;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
`;

// const Label = styled.label`
//   ${space}
//   font-family: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "avenir next", avenir, "Segoe UI", Arial, sans-serif';
//   color: #717171;
//   font-size: 12px;
//   font-weight: 500;
//   margin-bottom: 8px;
// `;
//
// const Input = styled.input`
//   ${space}
//   font-family: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "avenir next", avenir, "Segoe UI", Arial, sans-serif';
//   background-color: #fff;
//   border: 1px solid #f1f1f1;
//   border-radius: 0px;
//   box-sizing: border-box;
//   color: #152025;
//   height: 40px;
//   margin: 0 0 20px 0;
//   padding: 5px 10px;
//   font-size: 13px;
//   width: 100%;
//   &:focus {
//     outline: none;
//   }

export const PageContainer = styled(Box)`
  background-color: #fff;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  display: block;
`;

export const UnderlineLink = styled.p`
  margin-top: 16px;
  text-align: center;
  color: #474746;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

export const HalfBox = styled(Box)`
  width: 100%;
  @media (min-width: 768px) {
    width: 50%;
    min-height: calc(100vh - 140px);
  }
`;

export const ImgBox = styled(Box)`
  background-image: url('/static/images/auth-back.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0;
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (min-width: 768px) {
    height: 100%;
  }
`;

export const PageBox = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;