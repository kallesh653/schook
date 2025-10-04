import { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Avatar,
  Chip,
  IconButton,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { baseUrl } from "../../../environment";
import NoData from "../../../basic utility components/NoData";

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import InfoIcon from '@mui/icons-material/Info';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SchoolIcon from '@mui/icons-material/School';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClassIcon from '@mui/icons-material/Class';

// Styled Components for Mobile App Experience
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)',
  [theme.breakpoints.down('md')]: {
    borderRadius: '16px',
    margin: theme.spacing(1, 0, 2, 0),
  },
}));

const NoticeCard = styled(Card)(({ theme, noticeType }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${getNoticeColor(noticeType, 0.2)}`,
  background: `linear-gradient(45deg, ${getNoticeColor(noticeType, 0.02)} 0%, #ffffff 100%)`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 30px ${getNoticeColor(noticeType, 0.15)}`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: getNoticeColor(noticeType),
  },
}));

const NoticeTypeChip = styled(Chip)(({ noticeType }) => ({
  background: getNoticeColor(noticeType),
  color: 'white',
  fontWeight: 600,
  '& .MuiChip-label': {
    fontSize: '0.75rem',
  }
}));

const RefreshFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
  color: 'white',
  zIndex: 1000,
  '&:hover': {
    background: 'linear-gradient(45deg, #4CAF50 50%, #8BC34A 100%)',
    transform: 'scale(1.1) rotate(180deg)',
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
  color: 'white',
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// Helper function to get notice colors
function getNoticeColor(type, opacity = 1) {
  const colors = {
    student: `rgba(33, 150, 243, ${opacity})`, // Blue
    teacher: `rgba(76, 175, 80, ${opacity})`, // Green
    general: `rgba(255, 152, 0, ${opacity})`, // Orange
    important: `rgba(244, 67, 54, ${opacity})`, // Red
    event: `rgba(156, 39, 176, ${opacity})`, // Purple
  };
  return colors[type?.toLowerCase()] || colors.teacher;
}

const NoticeTeacher = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchNotices = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${baseUrl}/notices/fetch/teacher`);
      setNotices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notices", error);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return formatDate(dateString);
  };

  const getNoticeIcon = (audience) => {
    switch (audience?.toLowerCase()) {
      case 'student':
        return <SchoolIcon />;
      case 'teacher':
        return <PersonIcon />;
      case 'important':
        return <PriorityHighIcon />;
      default:
        return <AnnouncementIcon />;
    }
  };

  const getNoticeStats = () => {
    const total = notices.length;
    const recent = notices.filter(notice =>
      new Date(notice.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const forTeachers = notices.filter(notice =>
      notice.audience?.toLowerCase() === 'teacher'
    ).length;

    return { total, recent, forTeachers };
  };

  const stats = getNoticeStats();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <NotificationsActiveIcon sx={{ fontSize: 60, animation: 'pulse 2s infinite' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}>
      {/* Header Card */}
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
          <NotificationsIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            🍎 Notice Board
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Stay informed with school announcements
          </Typography>
        </CardContent>
      </StyledHeaderCard>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatsCard>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Notices
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.recent}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              This Week
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard sx={{ background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.forTeachers}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              For Teachers
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Notices Grid */}
      {notices.length > 0 ? (
        <Grid container spacing={3}>
          {notices.map((notice, index) => (
            <Grid item xs={12} md={6} lg={4} key={notice._id}>
              <Fade in={true} timeout={300 + (index * 100)}>
                <NoticeCard noticeType={notice.audience}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Notice Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getNoticeColor(notice.audience, 0.1),
                          color: getNoticeColor(notice.audience),
                          width: 40,
                          height: 40,
                          mr: 2
                        }}
                      >
                        {getNoticeIcon(notice.audience)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}>
                          {notice.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <NoticeTypeChip
                            label={notice.audience}
                            size="small"
                            noticeType={notice.audience}
                          />
                          <Chip
                            icon={<CalendarTodayIcon />}
                            label={getTimeAgo(notice.date)}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Notice Content */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#555',
                        lineHeight: 1.6,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {notice.message}
                    </Typography>

                    {/* Notice Footer */}
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 2,
                      borderTop: '1px solid rgba(0,0,0,0.08)'
                    }}>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        📅 {formatDate(notice.date)}
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          color: getNoticeColor(notice.audience)
                        }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </CardContent>
                </NoticeCard>
              </Fade>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <NotificationsIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
            No Notices Available
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Check back later for new announcements and updates.
          </Typography>
        </Box>
      )}

      {/* Refresh FAB */}
      <RefreshFab
        onClick={fetchNotices}
        disabled={refreshing}
        size="medium"
      >
        <RefreshIcon sx={{
          animation: refreshing ? 'spin 1s linear infinite' : 'none',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }} />
      </RefreshFab>
    </Container>
  );
};

export default NoticeTeacher;