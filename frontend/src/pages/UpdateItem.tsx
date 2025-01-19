import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Alert, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
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

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
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
    <Container>
      <Typography variant="h4" gutterBottom>Update Item</Typography>
      {success && <Alert severity="success">{success}</Alert>}
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Item</InputLabel>
        <Select value={selectedItemId} onChange={handleSelectChange}>
          {items.map((item) => (
            <MenuItem key={item.id} value={item.id}>{`${item.name} - ${item.id}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedItemId && (
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} error={!!errors.name} helperText={errors.name} />
          <TextField fullWidth margin="normal" label="Description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} error={!!errors.description} helperText={errors.description} />
          <TextField fullWidth margin="normal" label="Color" value={formData.color} onChange={(e) => handleChange('color', e.target.value)} error={!!errors.color} helperText={errors.color} />
          <TextField fullWidth margin="normal" label="Price" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} error={!!errors.price} helperText={errors.price} type="number" />
          <Button type="submit" variant="contained" color="primary">Update</Button>
        </form>
      )}
    </Container>
  );
};

export default UpdateItem;
