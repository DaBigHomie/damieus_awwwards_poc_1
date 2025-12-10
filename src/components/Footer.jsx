export const Footer = () => {
  return (
    <footer>
      <div className="footer-brand">
        <h2>DAMIEUS</h2>
        <p>
          One World Center, NY NY
          <br />
          646-926-0213
        </p>
      </div>
      <div className="footer-col">
        <h4>Menu</h4>
        <ul>
          <li>
            <a href="#services">Home</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#work">Our Work</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Social</h4>
        <ul>
          <li>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </li>
          <li>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
