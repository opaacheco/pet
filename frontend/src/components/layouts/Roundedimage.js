import styles from "./Roundedimage.module.css";

function Roundedimage({ src, alt, width }) {
  return (
    <img
      className={`${styles.rounded_image} ${styles[width]}`}
      src={src}
      alt={alt}
    />
  );
}

export default Roundedimage;
