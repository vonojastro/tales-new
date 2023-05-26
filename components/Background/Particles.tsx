import { useCallback } from 'react'
import { loadFull } from 'tsparticles'
import particlesConfig from '../../particlesConfig/particles-config'
import RecursivePartial from "react-tsparticles";
import Particles from "react-tsparticles";
import IOptions from "react-tsparticles"

interface ParticlesProps {
  id: string;
  options?: object;
  // particlesLoaded: string | undefined;
  init?: ((engine: any) => Promise<void>) | undefined
  loaded?: ((container?: any | undefined) => Promise<void>) | undefined
}

const MyParticles: React.FC<ParticlesProps> = ({
  id,
  options,
  // particlesLoaded,
  init,
  loaded,
}) => {


  const particlesInit = useCallback(async (engine: any) => {
    console.log(engine)
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: any) => {
    await console.log(container)
  }, [])
  return (
    <div id='particle-background' className='h-[100px'>
      <Particles
        id={id}
        options={options}
        // particlesLoaded={particlesLoaded}
        init={particlesInit}
        loaded={particlesLoaded}
      />
    </div>

  );
};

export default MyParticles