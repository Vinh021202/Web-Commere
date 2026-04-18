import React, { useContext, useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import CircularProgress from '@mui/material/CircularProgress';
import { editData, fetchDataFromApi, postData } from '../../utils/api';

const AddAress = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressType, setAddressType] = useState('');
  const [formFields, setFormFields] = useState({
    address_line1: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    mobile: '',
    userId: '',
    addressType: '',
    lamdmark: '',
  });

  const context = useContext(MyContext);

  useEffect(() => {
    if (context?.userData?._id !== undefined) {
      setFormFields((prevState) => ({
        ...prevState,
        userId: context?.userData?._id,
      }));
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const handleChangeAddressType = (event) => {
    setAddressType(event.target.value);
    setFormFields((prevState) => ({
      ...prevState,
      addressType: event.target.value,
    }));
  };

  useEffect(() => {
    if (context?.addressMode === 'edit') {
      fetchAddress(context?.addressId);
    }
  }, [context?.addressMode, context?.addressId]);

  const resetForm = () => {
    setFormFields({
      address_line1: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      mobile: '',
      userId: context?.userData?._id || '',
      addressType: '',
      lamdmark: '',
    });
    setAddressType('');
    setPhone('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formFields.address_line1 === '') {
      context.alertBox('error', 'Vui lòng nhập địa chỉ cụ thể');
      return false;
    }

    if (formFields.city === '') {
      context.alertBox('error', 'Vui lòng nhập thành phố');
      return false;
    }

    if (formFields.state === '') {
      context.alertBox('error', 'Vui lòng nhập tỉnh/thành');
      return false;
    }
    if (formFields.pincode === '') {
      context.alertBox('error', 'Vui lòng nhập mã bưu chính');
      return false;
    }
    if (formFields.country === '') {
      context.alertBox('error', 'Vui lòng nhập quốc gia');
      return false;
    }
    if (phone === '') {
      context.alertBox('error', 'Vui lòng nhập số điện thoại');
      return false;
    }
    if (formFields.lamdmark === '') {
      context.alertBox('error', 'Vui lòng nhập mốc ghi chú');
      return false;
    }
    if (addressType === '') {
      context.alertBox('error', 'Vui lòng chọn loại địa chỉ');
      return false;
    }

    if (context?.addressMode === 'add') {
      setIsLoading(true);
      postData(`/api/address/add`, formFields, { withCredentials: true }).then((res) => {
        if (res?.error !== true) {
          context.alertBox('success', res?.message);
          setTimeout(() => {
            setIsLoading(false);
            context.setOpenAddressPanel(false);
          }, 500);

          context?.getUserAddress();
          resetForm();
        } else {
          context.alertBox('error', res?.message || 'Đã có lỗi xảy ra');
          setIsLoading(false);
        }
      });
    }

    if (context?.addressMode === 'edit') {
      setIsLoading(true);
      editData(`/api/address/${context?.addressId}`, formFields, { withCredentials: true }).then(() => {
        fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`).then((res) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          context?.getUserAddress(res.data);
          context.setOpenAddressPanel(false);
          resetForm();
        });
      });
    }
  };

  const fetchAddress = (id) => {
    fetchDataFromApi(`/api/address/${id}`).then((res) => {
      const addr = res?.address || res?.data || {};
      setFormFields({
        _id: addr?._id || '',
        address_line1: addr?.address_line1 || '',
        city: addr?.city || '',
        state: addr?.state || '',
        pincode: addr?.pincode || '',
        country: addr?.country || '',
        mobile: addr?.mobile || '',
        userId: addr?.userId || '',
        addressType: addr?.addressType || '',
        lamdmark: addr?.lamdmark || '',
      });
      setPhone(addr?.mobile ? String(addr?.mobile) : '');
      setAddressType(addr?.addressType || '');
    });
  };

  return (
    <form className="address-form-shell p-4 md:p-6" onSubmit={handleSubmit}>
      <div className="mb-6">
        <span className="listing-stat__label">
          {context?.addressMode === 'edit' ? 'Chỉnh sửa địa chỉ' : 'Địa chỉ mới'}
        </span>
        <h2 className="mt-2 text-[22px] font-[800] text-[#1f2937]">
          {context?.addressMode === 'edit' ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
        </h2>
        <p className="mb-0 mt-2 text-[13px] leading-6 text-[#6b7280]">
          Điền đầy đủ thông tin để việc giao hàng được xử lý nhanh và chính xác hơn.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextField
            className="w-full"
            label="Địa chỉ cụ thể"
            variant="outlined"
            size="small"
            name="address_line1"
            value={formFields.address_line1}
            onChange={onChangeInput}
          />
        </div>

        <TextField
          className="w-full"
          label="Thành phố"
          variant="outlined"
          size="small"
          name="city"
          value={formFields.city}
          onChange={onChangeInput}
        />

        <TextField
          className="w-full"
          label="Tinh/Thanh"
          variant="outlined"
          size="small"
          name="state"
          value={formFields.state}
          onChange={onChangeInput}
        />

        <TextField
          className="w-full"
          label="Ma buu chinh"
          variant="outlined"
          size="small"
          name="pincode"
          value={formFields.pincode}
          onChange={onChangeInput}
        />

        <TextField
          className="w-full"
          label="Quoc gia"
          variant="outlined"
          size="small"
          name="country"
          value={formFields.country}
          onChange={onChangeInput}
        />

        <div className="md:col-span-2">
          <PhoneInput
            defaultCountry="vn"
            value={phone}
            onChange={(phoneValue) => {
              setPhone(phoneValue);
              setFormFields((prevState) => ({
                ...prevState,
                mobile: phoneValue,
              }));
            }}
          />
        </div>

        <div className="md:col-span-2">
          <TextField
            className="w-full"
            label="Moc ghi chu"
            variant="outlined"
            size="small"
            name="lamdmark"
            value={formFields.lamdmark}
            onChange={onChangeInput}
          />
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-4">
        <FormControl>
          <FormLabel
            id="demo-row-radio-buttons-group-label"
            className="!mb-2 !text-[13px] !font-[800] !uppercase !tracking-[0.08em] !text-[#a65434]"
          >
            Loại địa chỉ
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            className="flex items-center gap-5"
            value={addressType}
            onChange={handleChangeAddressType}
          >
            <FormControlLabel value="Home" control={<Radio />} label="Nha rieng" />
            <FormControlLabel value="Office" control={<Radio />} label="Van phong" />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button type="submit" className="bg-org product-card__cta product-card__cta--primary w-full flex gap-2 items-center">
          {isLoading === true ? <CircularProgress color="inherit" /> : 'Lưu địa chỉ'}
        </Button>
      </div>
    </form>
  );
};

export default AddAress;
