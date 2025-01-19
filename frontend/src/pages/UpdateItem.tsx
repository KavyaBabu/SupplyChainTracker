import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Alert, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Grid } from '@mui/material';
import { updateItem, fetchItems } from '../services/api';

interface Item {
  id: string;
  name: string;
  description: string;
  color: string;
  price: number;
}

const UpdateItem = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', color: '', price: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchItemsList = async () => {
      try {
        const data = await fetchItems();
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('Unexpected API response:', data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItemsList();
  }, []);

  const handleSelectChange = (event: any) => {
    const itemId = event.target.value as string;
    setSelectedItemId(itemId);
    const selectedItem = items.find(item => item.id === itemId);
    if (selectedItem) {
      setFormData({
        name: selectedItem.name,
        description: selectedItem.description,
        color: selectedItem.color,
        price: selectedItem.price.toString(),
      });
    }
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = `${field} is required`;
    } else {
      if (field === 'name' && !/^[a-zA-Z0-9 ]+$/.test(value)) {
        error = 'Name must contain only letters and numbers';
      } else if ((field === 'description' || field === 'color') && !/^[a-zA-Z ]+$/.test(value)) {
        error = `${field} must contain only letters`;
      }
    }
    return error;
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    newErrors.name = validateField('Name', formData.name);
    newErrors.description = validateField('Description', formData.description);
    newErrors.color = validateField('Color', formData.color);
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      newErrors.price = 'Valid price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).every(key => newErrors[key] === '');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      await updateItem(selectedItemId, formData);
      setSuccess('Item updated successfully!');
      setErrors({});
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '10px' }}>
      <Card className="form-card" elevation={3}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Update Item
          </Typography>
          {success && <Alert severity="success" className="alert-success">{success}</Alert>}
          <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Item</InputLabel>
                  <Select value={selectedItemId} onChange={handleSelectChange}>
                    {items.map((item) => (
                      <MenuItem key={item.id} value={item.id}>{`${item.name} - ${item.id}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {selectedItemId && (
                <>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Name" variant="outlined" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} error={!!errors.name} helperText={errors.name} className="input-field" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Description" variant="outlined" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} error={!!errors.description} helperText={errors.description} className="input-field" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Color" variant="outlined" value={formData.color} onChange={(e) => handleChange('color', e.target.value)} error={!!errors.color} helperText={errors.color} className="input-field" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Price" type="number" variant="outlined" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} error={!!errors.price} helperText={errors.price} className="input-field" />
                  </Grid>
                  <Grid item xs={12} className="button-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary" size="large" className="styled-button">
                      Update
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpdateItem;
