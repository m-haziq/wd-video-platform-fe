import { useContext } from 'react'
import VideoContext from '../contexts/VideoContext'

const useVideo = () => useContext(VideoContext) 

export default useVideo