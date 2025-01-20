import { useEffect, useState } from 'react';
import { fetchItems, fetchLastEvent, fetchItemEvents } from '../services/api';
import {
  TextField, Container, Typography, Card, CardContent, CardActions, Button,
  Grid, Tooltip, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  ToggleButton, ToggleButtonGroup, useMediaQuery, Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import TableViewIcon from '@mui/icons-material/TableView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

interface Item {
  id: string;
  name: string;
  description?: string;
  price?: string;
  color?: string;
  lastEvent?: string;
  events: [];
}

interface Event {
  id: string;
  itemId: string;
  status: string;
  type: string;
  location?: string;
  custodian?: string;
  timestamp: string;
  notes?: string;
}
const ViewItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [eventList, setEventList] = useState<Event[]>([]);
  const [highlightedEvent, setHighlightedEvent] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data: Item[] = await fetchItems();
      const itemsWithLastEvent = await Promise.all(
        data.map(async (item: Item) => {
          if (!item.events || item.events.length === 0) {
            return { ...item, lastEvent: '' };
          }
          try {
            const lastEvent = item.id ? await fetchLastEvent(item.id) : null;
            return { ...item, lastEvent: lastEvent?.status || '' };
          } catch (error) {
            console.error("Error fetching last event:", error);
            return { ...item, lastEvent: '' };
          }
        })
      );
      setItems(itemsWithLastEvent);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleOpenDialog = async (itemId: string) => {
    try {
      const events = await fetchItemEvents(itemId);
      setEventList(events);
      setHighlightedEvent(events.length > 0 ? events[events.length - 1].status : null);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching item events:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEventList([]);
    setHighlightedEvent(null);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newView) => newView && setViewMode(newView)}
          aria-label="View Mode"
        >
          <ToggleButton value="table" aria-label="Table View">
            <TableViewIcon /> Table View
          </ToggleButton>
          <ToggleButton value="card" aria-label="Card View">
            <ViewModuleIcon /> Card View
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box display="flex" justifyContent="center" sx={{ width: '100%', mt: 2 }}>
        <TextField
          variant="outlined"
          label="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by item name..."
          sx={{
            width: isMobile ? '100%' : '50%',
            maxWidth: '600px',
            '& .MuiInputBase-root': {
              borderRadius: '25px',
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />,
          }}
        />
      </Box>

      {viewMode === 'table' ? (
        <TableContainer component={Paper} sx={{ mt: 3, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                <TableCell><b>Item Name</b></TableCell>
                <TableCell><b>ID</b></TableCell>
                {!isMobile && <TableCell><b>Description</b></TableCell>}
                <TableCell><b>Color</b></TableCell>
                {!isMobile && <TableCell><b>Price</b></TableCell>}
                <TableCell><b>Last Event</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  {!isMobile && <TableCell>{item.description || 'N/A'}</TableCell>}
                  <TableCell style={{ color: item.color ? item.color.toLowerCase() : 'inherit' }}>
                    {item.color || 'N/A'}
                  </TableCell>
                  {!isMobile && <TableCell>{item.price || 'N/A'}</TableCell>}
                  <TableCell>
                    {item.lastEvent ? (
                      <Tooltip title={item.lastEvent} arrow>
                        <span
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => handleOpenDialog(item.id)}
                        >
                          {item.lastEvent}
                        </span>
                      </Tooltip>
                    ) : 'No Events'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ boxShadow: 3, borderRadius: '10px', p: 2, textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    <b>ID:</b> {item.id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <b>Description:</b> {item.description || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: item.color?.toLowerCase() }}>
                    <b>Color:</b> {item.color || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <b>Price:</b> {item.price || 'N/A'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button variant="contained" color="primary" onClick={() => handleOpenDialog(item.id)}>
                    View Events
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Item Events</DialogTitle>
        <DialogContent>
          <List>
            {eventList.map((event) => (
              <ListItem key={event.id} style={{ backgroundColor: event.status === highlightedEvent ? '#d4edda' : 'transparent' }}>
                <ListItemText
                  primary={<b>{event.status}</b>}
                  secondary={
                    <>
                      <Typography component="span" variant="body2"><b>ID:</b> {event.id}</Typography><br />
                      <Typography component="span" variant="body2"><b>Item ID:</b> {event.itemId}</Typography><br />
                      <Typography component="span" variant="body2"><b>Type:</b> {event.type}</Typography><br />
                      <Typography component="span" variant="body2"><b>Location:</b> {event.location || 'N/A'}</Typography><br />
                      <Typography component="span" variant="body2"><b>Custodian:</b> {event.custodian || 'N/A'}</Typography><br />
                      <Typography component="span" variant="body2"><b>Timestamp:</b> {new Date(event.timestamp).toLocaleString()}</Typography><br />
                      <Typography component="span" variant="body2"><b>Notes:</b> {event.notes || 'N/A'}</Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ViewItems;
