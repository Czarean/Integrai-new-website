import React, { useEffect, useRef, useState } from 'react';
import { ListChecks, Search, Wrench, Sparkles, TrendingUp, DollarSign, Zap, Phone } from 'lucide-react';
import TypeWriter from './components/TypeWriter';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

function App() {
  const [visibleSolutions, setVisibleSolutions] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const solutions = [
    "Contact Centers",
    "Schools",
    "QA Departments",
    "HR",
    "Logistics",
    "SMBs"
  ];

  const introText = "Our AI-driven automation syncs your apps and wipes out manual work, with flawless, nonstop AI that supercharges efficiency, quality, and customer satisfaction—custom-built for you.";

  useEffect(() => {
    const scrollWidth = solutions.length * 300; // Approximate width of each item
    let position = 0;
    
    const scroll = () => {
      position = (position + 1) % scrollWidth;
      setScrollPosition(position);
      requestAnimationFrame(scroll);
    };

    const scrollAnimation = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(scrollAnimation);
    };
  }, [solutions.length]);

  const processSteps = [
    {
      icon: <ListChecks className="w-8 h-8 text-[#4169E1]" />,
      step: "STEP 1",
      title: "We map out your processes",
      description: "We'll create a visual map of all your systems, manual tasks and apps."
    },
    {
      icon: <Search className="w-8 h-8 text-[#4169E1]" />,
      step: "STEP 2",
      title: "We find areas to add AI and automate",
      description: "We audit your workflows to pinpoint opportunities with the highest ROI."
    },
    {
      icon: <Wrench className="w-8 h-8 text-[#4169E1]" />,
      step: "STEP 3",
      title: "We build and test",
      description: "We use a mix of custom code, AI tools, Zapier, Make.com and your tech stack."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-[#4169E1]" />,
      step: "STEP 4",
      title: "We manage and iterate",
      description: "Every client we work with grows, so there's always new things to automate."
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-12 h-12 text-[#ff5722]" />,
      title: "Increase Efficiency",
      description: "With our AI technology solutions, your business can operate 24/7 without breaks, liberating your team from mundane and repetitive tasks. This allows your employees to save time and focus on strategic tasks that fuel innovation and growth."
    },
    {
      icon: <DollarSign className="w-12 h-12 text-[#ff5722]" />,
      title: "Reduce Operational Costs",
      description: "Automation dramatically cuts down your operational costs by handling high-volume, repetitive tasks that would otherwise require significant man-hours. By reallocating your resources towards more value-driven tasks, you further optimize costs and enhance profitability."
    },
    {
      icon: <Zap className="w-12 h-12 text-[#ff5722]" />,
      title: "Accelerate Scaling",
      description: "Our AI automation solutions provide the flexibility and efficiency to scale up your operations without proportionally increasing costs. Coupled with data-driven insights that facilitate informed decisions, our services let you adapt and expand at an unprecedented speed."
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let isHeaderSection = true;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.035), 70);
      particles = Array(particleCount).fill(null).map(() => createParticle());
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    });

    const drawParticle = (particle: Particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${particle.opacity})`;
      ctx.fill();
    };

    const drawConnections = (particle: Particle, particles: Particle[]) => {
      const connectionRadius = isHeaderSection ? 105 : 84;
      const maxOpacity = isHeaderSection ? 0.8 : 0.15;

      particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionRadius) {
          const opacity = (1 - distance / connectionRadius) * maxOpacity;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      if (isHeaderSection) {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 140;

        if (distance < interactionRadius) {
          const force = (1 - distance / interactionRadius) * 0.2;
          particle.vx += dx * force * 0.01;
          particle.vy += dy * force * 0.01;
        }
      }
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx += (Math.random() - 0.5) * 0.01;
      particle.vy += (Math.random() - 0.5) * 0.01;

      particle.vx *= 0.99;
      particle.vy *= 0.99;

      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scrollY = window.scrollY;
      isHeaderSection = scrollY < window.innerHeight;

      particles.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
        drawConnections(particle, particles);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    const solutionsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let counter = 0;
            const interval = setInterval(() => {
              if (counter < solutions.length) {
                setVisibleSolutions(prev => prev + 1);
                counter++;
              } else {
                clearInterval(interval);
              }
            }, 800);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (solutionsRef.current) {
      solutionsObserver.observe(solutionsRef.current);
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observer.disconnect();
      solutionsObserver.disconnect();
    };
  }, [solutions.length]);

  return (
    <div className="bg-space min-h-screen text-white relative">
      <canvas ref={canvasRef} id="network-canvas" className="fixed inset-0 z-0" />
      
      <div className="content-wrapper">
        <div className="side-text pixel-text">
          AI Automation Solutions
        </div>

        <header className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 bg-black/30 backdrop-blur-sm border-b border-[#4169E1]/10">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-white glow-text-white">Integr</span>
            <span className="text-[#00f2fe] glow-text">:AI</span>
          </h1>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/contact-center" className="text-[#4169E1] hover:text-[#00f2fe] transition-colors duration-300 font-medium">
              Contact Center Solutions
            </a>
            <a href="/schools" className="text-[#4169E1] hover:text-[#00f2fe] transition-colors duration-300 font-medium">
              Schools
            </a>
            <a href="/smbs" className="text-[#4169E1] hover:text-[#00f2fe] transition-colors duration-300 font-medium">
              SMBs
            </a>
            <a href="/portfolio" className="text-[#4169E1] hover:text-[#00f2fe] transition-colors duration-300 font-medium">
              Portfolio
            </a>
            <a href="/about" className="text-[#4169E1] hover:text-[#00f2fe] transition-colors duration-300 font-medium">
              About
            </a>
            <a href="/contact" className="text-[#4169E1] hover:text-[#00f2fe] transition-colors duration-300 font-medium">
              Contact
            </a>
          </nav>

          <div className="md:hidden menu-button">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </header>

        <section className="section">
          <div className="section-content min-h-screen flex flex-col items-center justify-center px-4">
            <h2 className="pixel-text text-2xl mb-4 text-[#00f2fe] relative z-10">AI Automation Solutions</h2>
            <h1 className="pixel-text text-7xl md:text-9xl mb-8 tracking-widest flex items-center justify-center relative z-10">
              <span className="text-white glow-text-white">Integr</span>
              <span className="text-[#00f2fe] glow-text blink">:AI</span>
            </h1>
            <div className="max-w-3xl mx-auto relative z-10">
              <TypeWriter
                text={introText}
                delay={40}
                className="text-lg md:text-xl text-gray-300 leading-relaxed"
              />
            </div>
          </div>
        </section>

        <section className="section py-12" ref={solutionsRef}>
          <div className="section-content px-4 relative z-10">
            <div className="max-w-6xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl border border-[#4169E1]/10 p-12 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <h2 className="text-4xl md:text-6xl font-bold text-center mb-8 pixel-text">
                Our solutions have optimized
              </h2>
              
              <div className="solutions-container relative">
                <div 
                  className="solutions-scroll flex space-x-8"
                  style={{
                    transform: `translateX(-${scrollPosition}px)`,
                  }}
                >
                  {[...solutions, ...solutions].map((solution, index) => (
                    <div
                      key={`${solution}-${index}`}
                      className="solution-item flex-none"
                    >
                      <div className="p-6 rounded-lg border border-[#4169E1]/10 hover:border-[#4169E1]/30 transition-all duration-300 min-w-[250px] bg-black/20">
                        <h3 className="text-2xl font-bold text-[#4169E1] text-center whitespace-nowrap">{solution}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section py-12">
          <div className="section-content px-4 relative z-10">
            <div className="max-w-6xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl border border-[#4169E1]/10 p-12 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 pixel-text">
                How our <span className="text-[#4169E1]">AI</span> and <span className="text-[#4169E1]">Automation</span> agency works
              </h2>
              
              <p className="text-center text-gray-300 text-lg mb-16 max-w-4xl mx-auto">
                We get under the hood of your business and find opportunities to replace the most manual, repetitive and expensive bottlenecks with AI-powered, automated processes. We only use AI if there's a practical use case.
              </p>
              
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-[#4169E1]/30" />
                
                <div className="grid md:grid-cols-4 gap-12 relative">
                  {processSteps.map((step, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-20 bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-[#4169E1] flex items-center justify-center relative z-10 mb-8 hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(65,105,225,0.3)]">
                        {step.icon}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="text-[#4169E1] font-semibold tracking-wider">
                          {step.step}
                        </div>
                        <h3 className="text-xl font-bold">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section py-12">
          <div className="section-content px-4 relative z-10">
            <div className="max-w-6xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl border border-[#4169E1]/10 p-12 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <h2 className="text-4xl md:text-6xl font-bold text-center mb-8 pixel-text">
                Benefits of <span className="text-[#4169E1]">AI</span> Solutions and <span className="text-[#4169E1]">Automation</span>
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`group ${
                      index % 2 === 0 ? 'slide-left' : 'slide-right'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center p-6 rounded-xl border border-orange/10 hover:border-orange/30 transition-all duration-500 hover:-translate-y-2">
                      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-[#ff5722]">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 pixel-text">
                  Ready to Transform Your Business?
                </h3>
                <button 
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#4169E1] to-[#00f2fe] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(65,105,225,0.5)]"
                  onClick={() => window.location.href = 'mailto:contact@integrai.com'}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Free Discovery Call
                  <div className="absolute inset-0 bg-white/20 transform translate-y-full transition-transform group-hover:translate-y-0"></div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;