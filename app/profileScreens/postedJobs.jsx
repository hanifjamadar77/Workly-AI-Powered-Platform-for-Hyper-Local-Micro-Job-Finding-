import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getJobsByUser, getCurrentUser } from '@/lib/appwrite';
import { useRouter } from 'expo-router';
import { images } from "@/constants";
import Header from '@/components/profileHeader';

export default function PostedJobsScreen() {
  const router = useRouter();
  const navigation = useNavigation; // Using router for navigation
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUserJobs = async () => {
    try {
      setLoading(true);
      
      // Get current logged-in user
      const user = await getCurrentUser();
      if (!user) {
        console.log('No user logged in');
        return;
      }
      
      setCurrentUser(user);
      console.log('Fetching jobs for user:', user.accountId);
      
      // Fetch only this user's jobs
      const userJobs = await getJobsByUser(user.accountId);
      console.log('User jobs fetched:', userJobs.length);
      
      setJobs(userJobs);
    } catch (error) {
      console.error('Error fetching user jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserJobs();
  }, []);

  const JobCard = ({ job }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => router.push(`/supportPages/jobDetails?jobId=${job.$id}`)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {job.title}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {job.description}
          </Text>
        </View>
        <View className="bg-green-100 px-3 py-1 rounded-full ml-2">
          <Text className="text-green-700 text-xs font-medium">Active</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap mb-3">
        <View className="flex-row items-center mr-4 mb-2">
          <Text className="text-gray-500 mr-1">📍</Text>
          <Text className="text-sm text-gray-600">{job.city}, {job.state}</Text>
        </View>
        <View className="flex-row items-center mr-4 mb-2">
          <Text className="text-gray-500 mr-1">💰</Text>
          <Text className="text-sm font-semibold text-gray-800">₹{job.pay}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-500 mr-1">👥</Text>
          <Text className="text-sm text-gray-600">{job.peopleNeeded} needed</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
        <Text className="text-xs text-gray-500">
          Posted: {new Date(job.createdDate).toLocaleDateString()}
        </Text>
        {/* <View className="flex-row">
          <TouchableOpacity className="bg-indigo-100 px-3 py-2 rounded-lg mr-2">
            <Text className="text-indigo-600 text-xs font-medium">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-red-100 px-3 py-2 rounded-lg">
            <Text className="text-red-600 text-xs font-medium">Delete</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Use custom Header component */}
        <Header title="Posted Jobs" />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-500 mt-4">Loading your jobs...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Stats Card */}
          <View className="bg-indigo-600 rounded-2xl p-5 mb-4" style={{ backgroundColor: '#6366f1' }}>
            <Text className="text-white text-sm opacity-90 mb-1">Total Jobs Posted</Text>
            <Text className="text-white text-3xl font-bold">{jobs.length}</Text>
          </View>

          {/* Jobs List */}
          {jobs.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">📋</Text>
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                No Jobs Posted Yet
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-6">
                Start posting jobs to find workers
              </Text>
              <TouchableOpacity
                className="bg-indigo-600 px-6 py-3 rounded-xl"
                onPress={() => router.replace('/(seeker)/post')}
              >
                <Text className="text-white font-semibold">Post Your First Job</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text className="text-base font-semibold text-gray-800 mb-3">
                Your Active Jobs
              </Text>
              {jobs.map((job) => (
                <JobCard key={job.$id} job={job} />
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* Floating Action Button */}
      {!loading && jobs.length > 0 && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full justify-center items-center shadow-lg"
          onPress={() => router.replace('/(seeker)/post')}
        >
          <Text className="text-white text-2xl">+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}