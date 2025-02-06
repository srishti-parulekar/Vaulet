import "./LandingPage.css";
import dataImage from "../../assets/data.png";
import winImage from "../../assets/win.png";
import ideaImage from "../../assets/idea.png";
import walletImage from "../../assets/walletNOBG.png"
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"
const LandingPage = () => {
    const navigate = useNavigate();

    const handleLoginSubmit = () => {
        navigate('/login');
    };

    const handleRegisterSubmit = () => {
        navigate('/register');
    }
  return (
    <div className="landing-page">
      <header>
        <nav>
          <div className="logo">
            <img src={walletImage} alt="wallet"
            style={{ width: "70px", height: "auto"}}/>
            Vaulet</div>
          <ul className="nav-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#how-it-works">How It Works</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
            <li>
              <a onClick={handleLoginSubmit} style={{color: "white"}}>Login</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <div className="topBlur"></div>
        <div className="bottomBlur"></div>
        <section className="hero">
          <h1 className="hero-title">
            Make savings fun with,
            <br />
            <span className="hero-title--gradient"> Vaulet.</span>
          </h1>

          <p className="hero-subtitle">
            Gamify your budgeting process and achieve your financial goals.
          </p>
          <button className="cta-button" onClick={handleRegisterSubmit} >Get Started</button>
        </section>

        <section id="features" className="features">
          <h1 className="titles">Key Features</h1>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Exciting Challenges</h3>
              <p>
                Take on "No Spend Week" or "Save ₹5000 in 30 Days" challenges
              </p>
            </div>
            <div className="feature-card">
              <h3>Rewards & Badges</h3>
              <p>Earn rewards and badges for meeting your saving goals</p>
            </div>
            <div className="feature-card">
              <h3>Leaderboard</h3>
              <p>Compare your progress with friends and family</p>
            </div>
            <div className="feature-card">
              <h3>Virtual Savings Jars</h3>
              <p>
                Create "vaults" for specific goals like vacations or gadgets
              </p>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="how-it-works-section">
          <div className="container">
            <h2 className="titles">How It Works</h2>
            <div className="how-it-works-cards">
              <div className="how-it-works-card">
                <img
                  src={ideaImage}
                  alt="Idea"
                  style={{ width: "400px", height: "auto" }}
                />
                <div className="how-it-works-data">
                  <div className="card-number">1</div>
                  <h3 className="how-it-works-card-title">Set Your Goals</h3>
                  <p className="how-it-works-card-text">
                    Create virtual savings jars for your specific financial
                    goals.
                  </p>
                </div>
              </div>
              <div className="how-it-works-card">
                <div className="how-it-works-data">
                  <div className="card-number">2</div>
                  <h3 className="how-it-works-card-title">
                    Take on Challenges
                  </h3>
                  <p className="how-it-works-card-text">
                    Participate in exciting saving challenges to boost your
                    progress.
                  </p>
                </div>
                <img
                  src={dataImage}
                  alt="Data"
                  style={{ width: "400px", height: "auto" }}
                />
              </div>
              <div className="how-it-works-card">
                <img
                  src={winImage}
                  alt="Win"
                  style={{ width: "400px", height: "auto" }}
                />
                <div className="how-it-works-data">
                  <div className="card-number">3</div>
                  <h3 className="how-it-works-card-title">Track & Celebrate</h3>
                  <p className="how-it-works-card-text">
                    Monitor progress and celebrate as you reach your savings
                    goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="testimonials">
          <h2 className="titles">What Our Users Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>
                "Vaulet made saving money actually enjoyable! I've never been so
                motivated to budget."
              </p>
              <span>- Priya S.</span>
            </div>
            <div className="testimonial-card">
              <p>
                "The challenges and rewards keep me engaged. I've saved more in
                3 months than I did all last year!"
              </p>
              <span>- Rahul M.</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Vaulet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
