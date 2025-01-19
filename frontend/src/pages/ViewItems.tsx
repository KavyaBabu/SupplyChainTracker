import { useEffect, useState } from 'react';
import { fetchItems, fetchLastEvent, fetchItemEvents } from '../services/api';
import { TextField, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, DialogTitle, Dialog, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Item {
  id: string;
  name: string;
  description?: string;
  price?: string;
  color?: string;
  lastEvent?: string;
  events: [];
}

const ViewItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [eventList, setEventList] = useState<any[]>([]);
  const [highlightedEvent, setHighlightedEvent] = useState<string | null>(null);

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
      <div className="search-container">
        <TextField 
          variant="outlined" 
          label="Search Items" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by item name..."
          className="search-bar-wide"
          InputProps={{
            startAdornment: <SearchIcon className="search-icon" />,
          }}
        />
      </div>
      <TableContainer component={Paper} style={{ marginTop: '20px' }} className="table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell><b>Item Name</b></TableCell>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Color</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Last Event</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} className="table-row">
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.description || 'N/A'}</TableCell>
                <TableCell style={{ color: item.color ? item.color.toLowerCase() : 'inherit' }}>
                  {item.color || 'N/A'}
                </TableCell>
                <TableCell>{item.price || 'N/A'}</TableCell>
                <TableCell>
                  {item.lastEvent ? (
                    <Tooltip title={item.lastEvent} arrow>
                      <span style={{ cursor: 'pointer', textDecoration: 'underline' }}  onClick={() => handleOpenDialog(item.id)}>{item.lastEvent}</span>
                    </Tooltip>
                  ) : 'No Events'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
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