document.addEventListener('DOMContentLoaded', loadPets);

async function loadPets() {
  try {
    const response = await fetch('http://3.137.223.60:3000/pets');
    const pets = await response.json();
    displayPets(pets);
  } catch (error) {
    console.error('Error loading pets:', error);
  }
}

function displayPets(pets) {
  const container = document.getElementById('pets-container');
  container.innerHTML = pets.map(pet => `
    <div class="pet-card">
      <img src="${pet.imageUrl}" alt="${pet.name}">
      <h3>${pet.name}</h3>
      <p>Age: ${pet.age}</p>
      <p>Breed: ${pet.breed}</p>
    </div>
  `).join('');
}

document.getElementById('pet-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('name', e.target.name.value);
  formData.append('age', e.target.age.value);
  formData.append('breed', e.target.breed.value);
  formData.append('image', e.target.image.files[0]);

  try {
    const response = await fetch('http://3.137.223.60:3000/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    if (result.success) {
      loadPets();
      e.target.reset();
      alert('Pet added successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error adding pet');
  }
});