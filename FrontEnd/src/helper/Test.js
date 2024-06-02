import React, { useEffect } from 'react';
import { setAuthUser, getAuthUser, removeAuthUser } from './helper/Storage';

const TestAuth = () => {
  useEffect(() => {
    // Test data
    const testUser = {
      username: 'testUser',
      token: '1234567890abcdef'
    };

    // Set the authentication user
    setAuthUser(testUser);
    console.log('User set in local storage:', testUser);

    // Get the authentication user
    const retrievedUser = getAuthUser();
    console.log('User retrieved from local storage:', retrievedUser);

    // Verify if the set and get functions work correctly
    if (retrievedUser && retrievedUser.token === testUser.token) {
      console.log('setAuthUser and getAuthUser are working correctly.');
    } else {
      console.log('There is an issue with setAuthUser or getAuthUser.');
    }

    // Clean up by removing the user from local storage
    removeAuthUser();
  }, []);

  return (
    <div>
      Check the console for results of setAuthUser and getAuthUser tests.
    </div>
  );
};

export default TestAuth;
