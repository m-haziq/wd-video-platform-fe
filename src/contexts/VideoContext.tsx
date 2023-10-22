import React, { createContext, useEffect, useReducer, ReactNode } from 'react';
import axios from '../axios';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

interface IRating {
  id: number;
  rating: number;
}
interface ITag {
  id: number;
  name: string;
}
interface IVideo {
  [x: string]: any;
  created_at: string | number | Date;
  id: number;
  title: string;
  description: string;
  url: string;
  tags: ITag[];
  ratings: IRating[];
}
interface IVideoState {
  videos: IVideo[];
}

type VideoAction =
  | { type: 'LOAD_VIDEOS'; payload: IVideo[] }
  | { type: 'REMOVE_VIDEO'; payload: IVideo[] }
  | { type: 'UPDATE_VIDEO'; payload: IVideo[] }
  | { type: 'SEARCH_VIDEO'; payload: IVideo[]  }
  | { type: 'SORT_VIDEO'; payload: IVideo[] }



interface VideoContextType {
  videos: IVideo[];
  removeVideo: (videoID: number) => void;
  updateReview: (videoID: number, rating: number) => void;
  getVideos: () => void;
  filterSearch?:(searcVideo:string)=> {};
  sortSearch?:(sortDropdown:string)=> void;
}
const inttialState:IVideoState ={
  videos:[]
}
const reducer = (state: IVideoState, action: VideoAction): IVideoState => {
  switch (action.type) {
    case 'LOAD_VIDEOS':
    case 'REMOVE_VIDEO':
    case 'UPDATE_VIDEO':
    case 'SEARCH_VIDEO':
    case 'SORT_VIDEO':
      return {
        ...state,
        videos: action.payload,
      };
    default:
      return state;
  }
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, inttialState);
  const { isAuthenticated } = useAuth();
  const removeVideo = async (videoID: number) => {
    
    try {
      await axios.delete(`/video/remove-video/${videoID}/`);
    const removedVideoID = videoID;

    const updatedVideos = state.videos.filter((video) => video.id !== removedVideoID);
    toast.success('Video marked as Not Interested Succesfully',{type: 'success'})
    dispatch({
      type: 'REMOVE_VIDEO',
      payload: updatedVideos,
    });
    } catch (e) {
      console.error(e);
    }
  };

  const updateReview = async (rating: number, videoID: number) => {
    
    try {
      await axios.put(`/video/rate-video/${videoID}/`, {
        id: videoID,
        rating: rating,
      });
      const updatedRating = {
        id: videoID,
        rating: rating,
      }
      const updatedItems = [...state.videos]?.map(item => {
        if (item.id === videoID) {
          return { ...item, ratings: [updatedRating] };
        }
        return item; 
      });
      toast.success('Review Updated!',{type: 'success'})
      
      dispatch({
        type: 'UPDATE_VIDEO',
        payload: updatedItems,
      });
    } catch (e) {
      toast.error((e as { detail?: string })?.detail || 'An error occurred', { type: 'error' });
      console.error(e);
    }
  };

  const getVideos = async () => {
    try {
      const res = await axios.get('/video/dashboard/');
      dispatch({
        type: 'LOAD_VIDEOS',
        payload: res.data?.videos,
      });
    } catch (e) {
      toast.error((e as { detail?: string })?.detail || 'An error occurred', { type: 'error' });

      console.error(e);
    }
  };

  const filterSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      await getVideos()
     
    }else{
      let SearchValue = searchTerm.toLowerCase();
      const filteredVideos = [...state.videos].filter((video) => {
        const titleMatch = video.title.toLowerCase().includes(SearchValue);
        const descMatch = video.description.toLowerCase().includes(SearchValue);
        const tagMatch = video.tags.some((tag) =>
          tag.name.toLowerCase().includes(SearchValue)
        );
    
        return titleMatch || tagMatch || descMatch;
      });
  
      dispatch({
        type: 'SEARCH_VIDEO',
        payload:filteredVideos,
      });

    }
  };
  const sortSearch = async (sortTerm: string) => {
  
    let sortedVideos = [...state.videos];
  
    switch (sortTerm) {
      case 'Title (A-Z)':
        // Sort videos by title in ascending order
        sortedVideos.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        break;
        
      case 'Title (Z-A)':
        // Sort videos by title in descending order
        sortedVideos.sort((a, b) => {
          return b.title.localeCompare(a.title);
        });
        break;
    
      case 'Creation Date (Latest First)':
        // Sort videos in descending order based on created_at (newest first)
        sortedVideos.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        break;
    
      case 'Creation Date (Oldest First)':
        // Sort videos in ascending order based on created_at (oldest first)
        sortedVideos.sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        break;
    
      case 'Rating (Highest First)':
        // Sort videos by rating in descending order, handling undefined ratings
        sortedVideos.sort((a, b) => {
          return (b.ratings?.[0]?.rating || 0) - (a.ratings?.[0]?.rating || 0);
        });
        break;
    
      case 'Rating (Lowest First)':
        // Sort videos by rating in ascending order, handling undefined ratings
        sortedVideos.sort((a, b) => {
          return (a.ratings?.[0]?.rating || 0) - (b.ratings?.[0]?.rating || 0);
        });
        break;
    
      default:
        // Handle the default case here
    }
    
    dispatch({
      type: 'SORT_VIDEO',
      payload: sortedVideos,
    });
  };

  
  

  useEffect(() => {
    if (isAuthenticated) {
      getVideos();
    }
  }, [isAuthenticated]);

  return (
    <VideoContext.Provider
      value={{
        videos: state.videos,
        removeVideo,
        updateReview,
        getVideos,
        filterSearch,
        sortSearch
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;