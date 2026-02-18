// Pakistan Provinces and Cities Data
export const pakistanData = {
    Punjab: [
        'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala',
        'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Jhang',
        'Rahim Yar Khan', 'Gujrat', 'Kasur', 'Sahiwal', 'Okara',
        'Wah Cantonment', 'Dera Ghazi Khan', 'Mirpur Khas', 'Nawabshah',
        'Chiniot', 'Kamoke', 'Mandi Burewala', 'Jhelum', 'Sadiqabad',
        'Khanewal', 'Hafizabad', 'Kohat', 'Jacobabad', 'Shikarpur'
    ],
    Sindh: [
        'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah',
        'Mirpur Khas', 'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu',
        'Thatta', 'Badin', 'Tando Adam', 'Tando Allahyar', 'Umerkot',
        'Sanghar', 'Matiari', 'Jamshoro', 'Naushahro Feroze', 'Ghotki'
    ],
    'Khyber Pakhtunkhwa': [
        'Peshawar', 'Mardan', 'Abbottabad', 'Mingora', 'Kohat',
        'Dera Ismail Khan', 'Swabi', 'Charsadda', 'Nowshera', 'Mansehra',
        'Bannu', 'Swat', 'Haripur', 'Karak', 'Hangu',
        'Lakki Marwat', 'Chitral', 'Buner', 'Dir', 'Malakand'
    ],
    Balochistan: [
        'Quetta', 'Turbat', 'Khuzdar', 'Hub', 'Chaman',
        'Gwadar', 'Sibi', 'Zhob', 'Loralai', 'Dera Murad Jamali',
        'Pishin', 'Mastung', 'Kalat', 'Kharan', 'Nushki',
        'Awaran', 'Panjgur', 'Lasbela', 'Jaffarabad', 'Nasirabad'
    ],
    'Islamabad Capital Territory': [
        'Islamabad'
    ],
    'Azad Kashmir': [
        'Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli', 'Bhimber',
        'Bagh', 'Palandri', 'Sudhnoti', 'Neelum', 'Haveli'
    ],
    'Gilgit-Baltistan': [
        'Gilgit', 'Skardu', 'Hunza', 'Ghanche', 'Diamer',
        'Astore', 'Ghizer', 'Nagar', 'Shigar', 'Kharmang'
    ]
};

export const getProvinces = () => Object.keys(pakistanData);

export const getCitiesByProvince = (province) => pakistanData[province] || [];
