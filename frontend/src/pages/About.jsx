import { ArrowRight, Target, Shield, Users, Heart, Award, Globe, Rocket } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import './About.css';

const About = () => {
    const { theme } = useTheme();
    const about = theme?.about;

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content">
                        <h1>{about?.title || 'About GlowNature'}</h1>
                        <p className="subtitle">{about?.subtitle || 'Our Story & Mission'}</p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-mission">
                <div className="container">
                    <div className="mission-grid">
                        <div className="mission-content">
                            <h2>Our Journey</h2>
                            <p className="mission-text">
                                {about?.content || 'Founded with a passion for natural beauty, GlowNature brings you the finest skincare products crafted with pure ingredients.'}
                            </p>
                            <div className="vision-box">
                                <h3>{about?.visionTitle || 'Our Vision'}</h3>
                                <p>{about?.visionContent || 'To empower natural beauty through sustainable and effective skincare solutions.'}</p>
                            </div>
                        </div>
                        <div className="mission-image">
                            {about?.image?.url ? (
                                <img src={about.image.url} alt="Our Journey" />
                            ) : (
                                <div className="placeholder-image">
                                    <Target size={100} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section with dynamic data */}
            <section className="about-stats">
                <div className="container">
                    <div className="stats-grid">
                        {about?.stats?.length > 0 ? (
                            about.stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <div className="stat-number">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="stat-item">
                                    <div className="stat-number">10k+</div>
                                    <div className="stat-label">Happy Customers</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">15+</div>
                                    <div className="stat-label">Years Experience</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">50+</div>
                                    <div className="stat-label">Product Awards</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">100%</div>
                                    <div className="stat-label">Natural Ingredients</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Values</h2>
                        <p>What drives us every day</p>
                    </div>
                    <div className="values-grid">
                        {(about?.values && about.values.length > 0) ? (
                            about.values.map((value, index) => {
                                const IconComponent = ({
                                    shield: Shield,
                                    users: Users,
                                    award: Award,
                                    heart: Heart,
                                    globe: Globe,
                                    rocket: Rocket,
                                    target: Target
                                }[value.icon?.toLowerCase()] || Shield);

                                return (
                                    <div key={index} className="value-card">
                                        <div className="value-icon">
                                            <IconComponent size={32} />
                                        </div>
                                        <h3>{value.title}</h3>
                                        <p>{value.description}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                <div className="value-card">
                                    <div className="value-icon">
                                        <Shield size={32} />
                                    </div>
                                    <h3>Quality First</h3>
                                    <p>We source only the purest ingredients for your skin.</p>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon">
                                        <Users size={32} />
                                    </div>
                                    <h3>Customer Focus</h3>
                                    <p>Your satisfaction and skincare goals are our priority.</p>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon">
                                        <Award size={32} />
                                    </div>
                                    <h3>Excellence</h3>
                                    <p>Constantly evolving our formulas for better results.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Team Section with dynamic data */}
            <section className="about-team">
                <div className="container">
                    <div className="section-header">
                        <h2>Meet Our Team</h2>
                        <p>The specialists behind your glow</p>
                    </div>
                    <div className="team-grid">
                        {about?.team?.length > 0 ? (
                            about.team.map((member, index) => (
                                <div key={index} className="team-member">
                                    <div className="member-image">
                                        {member.image?.url ? (
                                            <img src={member.image.url} alt={member.name} />
                                        ) : (
                                            <div className="member-placeholder"><Users size={40} /></div>
                                        )}
                                    </div>
                                    <h3>{member.name}</h3>
                                    <p>{member.role}</p>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="team-member">
                                    <div className="member-image">
                                        <div className="member-placeholder"><Users size={40} /></div>
                                    </div>
                                    <h3>Jane Doe</h3>
                                    <p>Founder & CEO</p>
                                </div>
                                <div className="team-member">
                                    <div className="member-image">
                                        <div className="member-placeholder"><Users size={40} /></div>
                                    </div>
                                    <h3>Dr. Sarah Smith</h3>
                                    <p>Head of Dermatology</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
