import { HeroSection }   from './HeroSection'
import { BentoFeatures } from './BentoFeatures'
import { Footer }        from '../../components/shared/Footer'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <BentoFeatures />
      <Footer />
    </div>
  )
}
