import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { checkIn, checkOut, getTodayStatus } from '../../api/attendanceApi';

const CheckInCheckOut: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await getTodayStatus();
      if (response.success) {
        setStatus(response.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setChecking(true);
    try {
      // Get user's location (optional)
      let location = '';
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          location = `${position.coords.latitude}, ${position.coords.longitude}`;
        } catch (err) {
          console.log('Location permission denied');
        }
      }

      const response = await checkIn(location);
      if (response.success) {
        toast.success(response.message);
        fetchStatus();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setChecking(true);
    try {
      const response = await checkOut();
      if (response.success) {
        toast.success(response.message);
        fetchStatus();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const isCheckedIn = status?.checkedIn;
  const isCheckedOut = status?.checkedOut;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance</h3>
      
      {isCheckedIn ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Check In Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(status.checkInTime).toLocaleTimeString()}
              </p>
              {status.isLate && (
                <p className="text-xs text-red-500 mt-1">
                  Late by {status.lateMinutes} minutes
                </p>
              )}
            </div>
            <div className="text-2xl">✅</div>
          </div>

          {!isCheckedOut && (
            <button
              onClick={handleCheckOut}
              disabled={checking}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {checking ? 'Processing...' : 'Check Out'}
            </button>
          )}

          {isCheckedOut && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Check Out Time</p>
                <p className="font-semibold text-gray-900">
                  {new Date(status.checkOutTime).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total Hours: {status.totalHours}
                </p>
              </div>
              <div className="text-2xl">🏁</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">You haven't checked in today</p>
          <button
            onClick={handleCheckIn}
            disabled={checking}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {checking ? 'Processing...' : 'Check In Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckInCheckOut;